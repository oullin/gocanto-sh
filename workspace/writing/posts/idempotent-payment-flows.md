---
title: Designing idempotent payment flows across retries, webhooks, and ledgers
date: 2026-06-25
updated: 2026-07-23
description: "A correctness model for payment retries: stable operation identities, explicit state transitions, signed webhooks, ambiguous provider outcomes, and ledger reconciliation."
tags: [payments, idempotency, webhooks, ledgers]
---

Payment software is designed for the second attempt.

The first request may work. The response may be lost. The browser may retry, a queue may redeliver,
or a provider may send the same webhook five times. If the system only behaves correctly when each
message arrives once, it does not behave correctly in production.

Idempotency is not a header added at the API edge. It is a chain of identities and state transitions
that connects the customer action, provider request, webhook, and ledger effect.

I built the wallet and ledger side of this at Aspire Financial Technologies, syncing local ledger
events against external providers, and again in a different shape at Perx, on a high-throughput Go
rewards-delivery service. In both systems, duplicate callbacks, ambiguous timeouts, and out-of-order
status events were normal operating conditions, so recovery could not guess or repeat a financial
effect.

## Give the logical operation one identity

Start with the business action: "capture order 8472 for SGD 129.00." Generate one operation ID and
reuse it on every attempt to perform that action.

```ts
type PaymentOperation = {
    id: string;
    orderId: string;
    amount: Money;
    state: "pending" | "submitted" | "confirmed" | "failed" | "unknown";
    providerReference?: string;
};
```

The idempotency record must bind the key to the normalized request. If the same key arrives with a
different amount or order, reject it. Returning the old result for a new payload hides a client bug
and can move the wrong amount.

Store the operation before making the provider call. A unique constraint on the operation ID turns
concurrent duplicate requests into one owner and one observer. The observer reads the existing
state instead of starting another charge.

## "No response" is not "failed"

The most dangerous payment outcome is ambiguity.

Suppose the provider accepted a charge, committed it, and the network failed before your service
received the response. Marking the payment failed invites an immediate retry and a duplicate
charge. Marking it successful invents evidence you do not have.

Use an explicit `unknown` state. Recovery then queries the provider by your idempotency key or
merchant reference, waits for a signed webhook, or sends the operation to reconciliation. The user
experience can say "processing" while the system determines the truth.

Only retry errors classified as safe. A connection refusal before bytes were sent is different from
a timeout after the request body left the process; the first is safe to retry, the second is
`unknown`. Provider adapters should return typed errors that preserve that distinction, because by
the time the error reaches the orchestration layer, the information is otherwise gone.

## Webhooks confirm; they do not get a free pass

Provider webhooks are at-least-once messages from an external trust boundary. Verify all three
properties before changing payment state:

1. the signature matches the exact raw body;
2. the signed timestamp is inside a narrow freshness window;
3. the event ID has not already been processed.

I have written about [why all three checks are needed and what each one prevents](/signed-webhooks)
separately; any two of them still leave a gap.

Store the event receipt and state change in one database transaction. If the process crashes after
the state update but before recording the event ID, the redelivery can apply the effect twice.

Out-of-order events also happen. A delayed `authorised` event must not move a payment backwards from
`captured`. Define allowed transitions in one place and retain ignored events for audit rather than
silently discarding them.

## The ledger is not the provider status table

A provider says what happened in its system. Your ledger says what the business owes and owns.
Keep those models separate.

Ledger entries should be immutable and balanced. Corrections are new entries, not edits to history.
A payment transition can emit the command that posts ledger entries, but posting uses its own stable
identity so a replay cannot duplicate the accounting effect.

```text
payment operation -> provider outcome -> domain transition -> ledger posting
       one ID              event ID          transition ID       posting ID
```

Each boundary deduplicates in its own terms while retaining the upstream correlation IDs. When
someone asks you to prove that one provider event produced exactly one ledger effect, this is what
lets you answer with a query instead of an investigation.

## Idempotency is what makes load management safe

At Aspire, peak load showed up first as contention rather than correctness: payment requests
arriving in bursts, all competing for the same accounts and the same provider budgets, with retries
stacking on top of the original load.

The fix was a prioritisation queue in front of the payment flow, which improved throughput and
reduced contention during peaks. It only worked because the operations underneath it were
idempotent. Queueing, prioritisation, back-pressure, and SLA-driven retries all reorder, delay, or
repeat work, and that is only safe when a repeated or delayed operation cannot duplicate its
financial effect.

## Reconciliation closes the gaps

Real payment correctness cannot depend only on real-time messages. Providers, queues, and your own
deployments will eventually miss something.

Run reconciliation against provider settlement or transaction reports. Match by provider reference,
merchant reference, currency, and amount. Differences become explicit work items:

- provider confirmed, local operation still unknown;
- local capture recorded, provider has no matching transaction;
- amount or currency mismatch;
- refund exists on one side only;
- duplicate provider transactions share one merchant reference.

Reconciliation is also how you prove the design. A dashboard with zero unexplained differences is
stronger evidence than a green API test suite.

## Make recovery an ordinary path

Idempotent payment architecture is successful when retries and replays are boring. A support
operator can find one operation, see every attempt and webhook, understand its current truth, and
run a safe recovery without editing a database row by hand.

That outcome comes from designing identity, ambiguity, state, and reconciliation together. The
idempotency header is only the first visible piece.

---

_[Signed webhooks](/signed-webhooks) covers the verification side of this in detail, and
[exactly-once ends where Kafka does](/kafka-go-payment-pipelines) applies the same model to event
pipelines. I run [Oullin](https://oullin.io), where this kind of payment correctness work is a
regular engagement. Find me on [X (@gocanto)](https://x.com/gocanto)._
