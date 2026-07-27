---
title: The case of the mismatched clocks
date: 2025-11-26
updated: 2026-07-27
description: "A timestamp-validation incident that showed why signed requests need an agreed clock, a narrow freshness window, and diagnostics that distinguish skew from forgery."
tags: [security, webhooks, hmac]
---

A signed request can have a valid HMAC and still be rejected because the sender and receiver
disagree about time.

That was the failure in an Oullin request-signing path. The client signed a timestamp with the
body. The server recomputed the signature successfully, then rejected the request because its
clock placed the timestamp outside the allowed freshness window.

The security check was working. The operational system around it was not.

## Why the timestamp is signed

A signature over only the body proves that someone with the secret produced that body. It
does not say when. A captured request could be replayed later with the same signature.

Binding a Unix timestamp to the payload gives the receiver a freshness check:

```text
signed_payload = timestamp + "." + raw_body
```

The receiver verifies the HMAC over the same bytes, then compares the signed timestamp with
its current time. Requests outside the accepted window are rejected.

This still does not provide idempotency. A valid request can be delivered twice inside the
window, so mutation handlers also need a stable event or operation identifier. The complete
webhook treatment is in [Signed webhooks done right](/signed-webhooks).

## The incident was a clock problem

The confusing symptom was an authentication failure even though the client secret and body
were correct. Logging only “signature rejected” made a freshness failure look like forgery.

The useful diagnostic values were:

- the server's current Unix time;
- the signed timestamp;
- the computed absolute difference;
- the configured tolerance;
- a reason code that distinguished malformed input, HMAC mismatch, and expired timestamp.

Secrets and raw signed bodies do not belong in those logs.

Once the two hosts were synchronized, the requests succeeded without weakening the window or
changing the signature algorithm.

## Controls around the verifier

The verifier should reject timestamps too far in either direction. A request from the future
can indicate clock skew just as clearly as an old request does.

Hosts should synchronize through an operating-system time service and alert when offset
exceeds an operational threshold smaller than the signature tolerance. That catches drift
before it becomes an application outage.

Tests should supply a clock rather than depend on wall time:

```ts
verify(
    {
        header,
        body,
        nowSeconds: 1_764_000_000,
        toleranceSeconds: 300,
    },
);
```

That makes the boundary cases deterministic: exactly at the window, one second outside it,
future timestamps, malformed values, and valid signatures with stale time.

The lesson was not to make the window large enough that clocks no longer matter. A wider
window also makes captured requests useful for longer. The right fix was accurate clocks,
specific diagnostics, and a verifier whose time dependency could be tested.
