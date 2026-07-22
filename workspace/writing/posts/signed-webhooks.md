---
title: Signed webhooks done right
date: 2026-07-18
description: 'Most webhook “security” is a shared secret and a prayer. Real signed webhooks are three parts: signature, timestamp window, idempotency. Everyone ships the first and forgets the other two. Code from sasu.sh, running on Cloudflare Workers.'
tags: [webhooks, security, cloudflare, hmac]
---

# Signed webhooks done right

Most webhook "security" is a shared secret in a header and a prayer.

That stops nobody. If your receiver just checks `Authorization: Bearer xxx`, a leaked
log line or a replayed request walks right in. The secret is static, so anything that
ever sees it once can impersonate the sender forever, and a captured request can be
sent again a thousand times.

Real signed webhooks are three parts. Almost everyone ships part one and forgets parts
two and three:

1. **Signature**: proves _who_ sent it and that the body wasn't modified.
2. **Timestamp window**: proves the request is _fresh_ (kills replays).
3. **Idempotency**: proves each event is _processed once_ (kills duplicate side effects).

Drop any one and you have a hole: forgery, replay, or double-charges. All three, or
it's theatre.

The code below is pulled from [sasu.sh](https://sasu.sh), a production system I run on
Cloudflare Workers: a small `signed-http` primitive shared by an annotator client, a CLI
bridge, and the server's webhook fanout. It uses the Web Crypto API (`crypto.subtle`), so
it runs unchanged on Workers, Deno, Bun, and modern Node.

## Part 1: Sign the body, not a token

Compute an HMAC-SHA256 over the payload, keyed by a per-subscriber secret. The one
detail people miss: **bind the signature to a timestamp** by prefixing it before you
sign. That timestamp is what makes part two possible.

```ts
async sign(secret: string, body: string, nowSeconds?: number): Promise<string> {
  const t = nowSeconds ?? Math.floor(Date.now() / 1000);

  const sig = await this.signHmacSha256(secret, `${t}.${body}`);

  return this.format(t, sig);
}

format(timestamp: number, signature: string): string {
  return `t=${timestamp},v1=${signature}`;
}
```

The wire format is `t=<unix-seconds>,v1=<hex-hmac>`. That `t=...,v1=...` shape is the
Stripe convention, so use it. Tooling already understands it, `v1` gives you room to
rotate the scheme later, and putting the timestamp in the header (not just the body)
means the receiver can check freshness without parsing your payload.

The actual HMAC is boring, which is the point:

```ts
async signHmacSha256(secret: string, body: string): Promise<string> {
  const key = await this.importHmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));

  return this.bytesToHex(sig);
}
```

Sending it is then a matter of setting the signature header alongside the body:

```ts
const signature = await Signature.create().sign(input.secret, input.body, input.nowSeconds);

const headers: Record<string, string> = {
    "Content-Type": "application/json",
    [SIGNATURE_HEADER]: signature,
};
```

## Part 2: Verify with a timestamp window _and_ a constant-time compare

Recomputing the HMAC is necessary but not sufficient. Two things get skipped constantly,
and both are in this one function:

```ts
async verify(
  header: string | null | undefined,
  secret: string,
  body: string,
  opts: VerifyOptions = {},
): Promise<Result<void, SignatureError>> {
  const parsed = this.parse(header);

  if (!parsed.ok) {
    return parsed;
  }

  const tolerance = opts.toleranceSeconds ?? DEFAULT_TOLERANCE_SECONDS;
  const now = opts.nowSeconds ?? Math.floor(Date.now() / 1000);

  // (1) Reject stale timestamps: this is the anti-replay check.
  if (Math.abs(now - parsed.value.timestamp) > tolerance) {
    return err(new SignatureError("stale-timestamp"));
  }

  const expected = await this.signHmacSha256(secret, `${parsed.value.timestamp}.${body}`);

  // (2) Constant-time compare: never use === on a signature.
  if (!this.timingSafeEqual(expected, parsed.value.signature)) {
    return err(new SignatureError("mismatch"));
  }

  return ok();
}
```

**The timestamp window** (`Math.abs(now - t) > tolerance`) is what turns a static
signature into a _fresh_ one. Without it, a captured request is valid forever: the
attacker doesn't need your secret, they just resend a request you already signed. Pick a
tolerance that survives normal clock skew and network latency but nothing more.
`DEFAULT_TOLERANCE_SECONDS` here is `5 * 60`, which is also what Stripe uses.

**The constant-time compare** matters because `expected === got` leaks information
through _how long the comparison takes_. A naive equality check bails on the first
differing byte, so an attacker can measure response times to recover the signature one
byte at a time. Compare every byte regardless:

```ts
timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return diff === 0;
}
```

Note the shape of both functions: they return a `Result` with a _named_ error
(`stale-timestamp`, `mismatch`, `missing-header`) rather than throwing a boolean. When a
webhook silently stops arriving at 3am, "why did verification fail" is the first
question, and a typed reason answers it without a debugger.

## Part 3: Idempotency, because retries are guaranteed

At-least-once delivery means the _same_ event **will** arrive twice. A network blip
between your `200` and their socket close, a receiver that 500s after committing, a
manual redelivery, all of them produce duplicates. If processing an event has side
effects (charge a card, insert a row, send a mail), duplicates are a correctness bug,
not an edge case.

The fix is a stable idempotency key **per logical operation**, reused on every retry of
that operation, so the receiver can dedupe:

```ts
export class IdempotencyCache {
    private readonly cache = new Map<string, string>();

    /** The stable idempotency key for a logical operation, minting one on first use. */
    keyFor(logicalKey: string): string {
        const existing = this.cache.get(logicalKey);

        if (existing) {
            return existing;
        }

        const key = uid("idem");

        this.cache.set(logicalKey, key);

        return key;
    }
}
```

The subtle part is _"per logical operation."_ If you mint a fresh key on every HTTP
attempt, dedup does nothing: each retry looks new. The key has to be derived from the
operation, not the transmission, so all attempts of "sync session 42" carry one key. The
sender attaches it as a header; the receiver records seen keys and drops repeats.

## The envelope carries the plumbing

Wrap events in a consistent envelope so delivery, verification, and replay all have
something stable to grab:

```ts
export interface DeliveryEnvelope<TEvent> {
    deliveryId: string;
    subscriptionId: string;
    event: TEvent;
}
```

- `deliveryId` is a per-attempt handle: it's what you log, and what a dead-letter queue
  replays.
- `subscriptionId` scopes _which_ secret verifies the signature.
- `event` stays caller-specific; the wrapper is generic over `TEvent` so a server that
  ships hash-chained events and a CLI that re-emits raw ones can reuse it.

## The mental model

Three properties, three failures they prevent:

| Mechanism        | Proves                   | Without it                 |
| ---------------- | ------------------------ | -------------------------- |
| HMAC signature   | authenticity + integrity | **forgery**                |
| Timestamp window | freshness                | **replay**                 |
| Idempotency key  | processed-once           | **duplicate side effects** |

Signature without a timestamp window is replayable. A timestamp window without
idempotency still double-processes on legitimate retries. Idempotency without a signature
trusts anyone who can guess a key. You need all three, or it's theatre.

---

_This is drawn from the `signed-http` and crypto primitives in
[sasu.sh](https://sasu.sh), a Cloudflare Workers app I maintain. If you want the wider
architecture around it: hash-chained event logs, dead-letter fanout, SSRF-checked
delivery. That's a future post. Find me on [X (@gocanto)](https://x.com/gocanto)._
