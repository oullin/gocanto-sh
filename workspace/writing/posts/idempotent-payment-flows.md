---
title: '"No response" is not "failed"'
date: 2026-06-25
updated: 2026-07-22
description: "Every duplicate charge starts as a timeout. Stable operation identities, an explicit unknown state, webhooks that confirm rather than assert, and reconciliation as the thing that actually proves the design."
tags: [payments, idempotency, webhooks, ledgers]
---

Every duplicate charge I have had to explain started life as a timeout.

Not a bug in the charging code. Not a race in the state machine. A request that went out,
did its job, and never came back, followed by software that decided what that meant. It
decided wrong, in the direction that costs money, and it did so quickly and confidently.

I built the wallet and ledger side of this at Aspire Financial Technologies, syncing local
ledger events against external providers, and again in a different shape at Perx, on a
high-throughput Go rewards-delivery service. Different domains, same lesson: payment
software is designed for the second attempt, and the second attempt is where the design
either holds or quietly does not.

## Give the logical operation one identity

Start from the business action, not the HTTP call. "Capture order 8472 for SGD 129.00" is
one operation, and it gets one ID that every attempt reuses.

```ts
type PaymentOperation = {
    id: string;
    orderId: string;
    amount: Money;
    state: "pending" | "submitted" | "confirmed" | "failed" | "unknown";
    providerReference?: string;
};
```

Two details do the real work here.

**Bind the key to the normalised request.** If the same idempotency key arrives with a
different amount or a different order, reject it. Returning the previous result for a new
payload feels forgiving and is how you move the wrong amount while reporting success.

**Store the operation before calling the provider.** A unique constraint on the operation ID
turns two concurrent duplicate requests into one owner and one observer. The observer reads
the existing state instead of starting a second charge, which is the entire behaviour you
wanted, obtained from the database rather than from a lock you have to maintain.

Note the fifth state.

## `unknown` is a state, and refusing to model it is a decision

The most dangerous outcome in payments is not failure. It is ambiguity.

The provider accepted the charge, committed it, and the network dropped before your service
saw the response. Now pick:

- Mark it **failed**, and you have invited an immediate retry and a duplicate charge.
- Mark it **successful**, and you have invented evidence you do not have.

Both are wrong, and both are what a system without an `unknown` state is forced to do.

With the state modelled, recovery becomes an ordinary code path: query the provider by your
idempotency key or merchant reference, wait for a signed webhook, or hand the operation to
reconciliation. Meanwhile the customer sees "processing", which is not a euphemism. It is
the most truthful thing the system can say.

Retry classification has to be just as precise. A connection refused before any bytes left
the process is a different event from a timeout after the request body was sent. The first is
safe to retry. The second is `unknown`. Provider adapters return typed errors that preserve
the distinction, because by the time it reaches the orchestration layer, that information is
gone forever.

**A retry policy that cannot tell those two apart is a duplicate-charge generator with a
scheduler.**

## Webhooks confirm. They do not get a free pass

Provider webhooks are at-least-once messages arriving from outside your trust boundary, and
they are frequently treated as if they were internal events, because they carry good news.

Verify all three properties before touching payment state: the signature matches the exact
raw body, the signed timestamp sits inside a narrow freshness window, and the event ID has
not already been processed. I have written about
[why all three are needed and what each one prevents](/signed-webhooks) separately; the short
version is that any two of them still leave a hole.

The part specific to payments is the transaction boundary. **Store the event receipt and the
state change in the same database transaction.** Split them and a crash between the state
update and the receipt write means the redelivery applies the effect a second time, which is
the exact bug the receipt existed to prevent.

Out-of-order events are routine, not exotic. A delayed `authorised` must not drag a payment
back from `captured`. Allowed transitions get defined in one place, and events that are
ignored are still retained. "We dropped it silently" is not an answer anyone accepts during a
reconciliation dispute.

## The ledger is not the provider's status table

A provider tells you what happened inside its system. Your ledger says what the business owns
and owes. Those are different claims and they need different models, however tempting the
shortcut looks at the start.

Ledger entries are immutable and balanced. Corrections are new entries, never edits to
history. A payment transition can emit the command that posts entries, but the posting has
its own stable identity, so a replay of the transition cannot duplicate the accounting.

```text
payment operation -> provider outcome -> domain transition -> ledger posting
       one ID              event ID          transition ID       posting ID
```

Four boundaries, four deduplication keys, each in its own terms, every one carrying the
upstream correlation ID. It looks like ceremony until the first time someone asks you to
prove that one provider event produced exactly one ledger effect, and you can answer with a
query instead of an investigation.

## Peak load is where this earns its keep

At Aspire the pressure showed up as contention rather than correctness at first. Payment
requests arriving in bursts, all contending for the same accounts and the same provider
budgets, with retries stacking on top of the original load in exactly the wrong moment.

The fix was a prioritisation queue in front of the payment flow, which lifted throughput and
cut contention during peaks. It only worked because the operations underneath it were
idempotent. **You cannot safely reorder, delay, or shed work whose effects are not
idempotent.** Queueing, prioritisation, back-pressure, and SLA-driven retries are all
downstream of that property. Without it, every one of them is a way to charge someone twice
under load.

That is the argument I would make to anyone who thinks idempotency is a correctness tax. It
is what buys you the right to schedule.

## Reconciliation is the only thing that proves any of it

Real-time messages are not enough. Providers, queues, and your own deployments will
eventually miss something, and the design has to assume that rather than hope.

Reconciliation runs against provider settlement and transaction reports, matching on provider
reference, merchant reference, currency, and amount. Differences become work items with
names: provider confirmed but the local operation is still unknown, local capture recorded
with no matching provider transaction, amount or currency mismatch, a refund that exists on
one side only, duplicate provider transactions sharing one merchant reference.

A dashboard showing zero unexplained differences is stronger evidence than any green test
suite. The tests prove the code does what I wrote. Reconciliation proves the money is where
everyone says it is.

## Recovery should be boring

The design is finished when retries and replays stop being interesting.

A support operator finds one operation, sees every attempt and every webhook against it,
understands its current truth, and runs a safe recovery without editing a database row by
hand. If any part of that requires an engineer, the identity, ambiguity, state, and
reconciliation model are not done yet.

The idempotency header is the first visible piece and roughly the last thing that matters.

---

_This is the payments-shaped version of [signed webhooks](/signed-webhooks), and the
pipeline-shaped version is [exactly-once ends where Kafka does](/kafka-go-payment-pipelines).
I run [Oullin](https://oullin.io), where this kind of payment correctness work is a regular
engagement. Find me on [X (@gocanto)](https://x.com/gocanto)._
