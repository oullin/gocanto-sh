---
title: "Kafka and Go for payment pipelines: backpressure, ordering, and replay"
date: 2026-05-28
updated: 2026-07-23
description: "Practical design for Kafka and Go payment pipelines: partitioning, bounded concurrency, inbox/outbox guarantees, external side effects, DLQs, replay, and operational evidence."
tags: [kafka, go, payments, event-driven]
---

Kafka can preserve a payment event perfectly and your system can still process it incorrectly.

I spent time on a payments pipeline at Silverlake that consolidated three different streams into
one system: ATM telemetry, account transactions, and cross-border payments. The broker was never
the problem. It gave us durable, ordered logs and lost nothing.

What it does not give you is a partition key, a bounded worker pool, an atomic database side
effect, or an answer to whether replaying a dead-letter event is safe. Those are all yours, and I
treat the pipeline as one end-to-end correctness boundary: producer transaction, partitioning,
consumer concurrency, external effects, and recovery all have to agree.

## Partition by the invariant that needs ordering

Global ordering is expensive and usually unnecessary. What matters is ordering for the entity whose
state transitions cannot cross.

The three streams did not share that entity. Account transactions partition by account ID. A
payment lifecycle partitions by payment ID. ATM telemetry mostly does not need ordering, until you
want per-device sequencing for a fault, and then the device ID is the correct key.

The key must be stable. Partitioning a payment by event type puts `authorised` and `captured` on
different logs and makes arrival order a race that only shows up under load. Random keys distribute
load beautifully while destroying the invariant.

Hot keys need an explicit answer, decided in advance. One merchant or settlement account can
dominate a partition, and changing the key is the one thing you cannot do casually. Decide whether
the domain can be split, whether the hot workflow needs its own topic, or whether serial processing
is the correct price of consistency for that entity.

## Bound concurrency in the consumer

The easiest Go consumer to write starts a goroutine for every message. Under normal load it looks
fast. During a downstream slowdown it converts Kafka lag into memory pressure, database contention,
and thousands of requests waiting on the same dependency.

Use a bounded worker model and pause consumption when the local queue is full.

```go
jobs := make(chan Message, workerCount*2)

for i := 0; i < workerCount; i++ {
    go worker(ctx, jobs)
}

for message := range consumer.Messages() {
    select {
    case jobs <- message:
    case <-ctx.Done():
        return ctx.Err()
    }
}
```

The real implementation must retain partition ordering: either assign one serial worker per active
partition or coordinate offsets so a later message cannot commit past a failed earlier one. A pool
that processes freely across partitions has given up the guarantee the partition key was chosen to
provide.

Concurrency is a capacity decision. Set it from downstream limits and measured service time, then
watch saturation and lag instead of assuming more workers mean more throughput.

## Exactly-once ends at the external boundary

Kafka transactions can atomically consume records and produce records within Kafka. They do not
atomically charge a provider, update an ordinary database, or send an email. The moment a handler
touches anything outside the cluster, delivery is at-least-once again and the effect has to be
idempotent.

For database-backed services, use inbox and outbox records:

1. insert the consumed event ID into an inbox table;
2. apply the domain change;
3. insert resulting events into an outbox;
4. commit all three in one database transaction;
5. publish the outbox separately and mark it delivered.

A unique constraint on the inbox event ID makes redelivery harmless. Step five is deliberately
outside the transaction: the outbox publisher may send an event twice if it crashes after
publishing but before marking it delivered, so downstream consumers still deduplicate.

External payment calls need their own idempotency identity on top of all of this. Kafka
exactly-once is not a reason to omit provider idempotency keys, and the failure that omission
produces is a duplicate charge rather than a duplicate row.

## Dead letters need replay semantics

A DLQ is useful only if the event carries enough context to diagnose and safely retry:

- original topic, partition, offset, and event ID;
- schema version and correlation ID;
- named failure class and redacted error detail;
- attempt count and first/last failure time;
- handler version that rejected it.

Separate transient exhaustion from permanent invalid data. Replaying malformed events into the same
consumer without a code or data change creates an expensive loop.

The replay tool should support one event, a bounded set, and a dry-run validation. It should write
a new audit event showing who replayed what and why. Recovery is a production mutation and deserves
the same controls as the original flow.

## Operate the whole path

Consumer lag alone does not explain pipeline health. Track:

- arrival and completion rate by event type;
- oldest unprocessed event age;
- processing duration and downstream wait time;
- retry and DLQ rate by named failure;
- inbox deduplication count;
- outbox age and publish attempts;
- reconciliation differences at the payment or ledger boundary.

Alerts should represent customer or settlement risk, not queue depth. A small lag on a quiet audit
topic is not the same incident as a growing capture backlog forty minutes before a settlement
cutoff, and an alert that cannot tell those apart gets muted.

## Replay is the test of the architecture

The pipeline is trustworthy when a team can stop it, repair a defect, replay a bounded window, and
prove that no payment or ledger effect was duplicated. That proof comes from the inbox
deduplication counts and the reconciliation report, not from an argument.

Kafka and Go provide excellent primitives for that system. The guarantee comes from how partition
keys, concurrency, transaction boundaries, idempotency, and operator tooling fit together.

---

_The idempotency half of this is in [designing idempotent payment
flows](/idempotent-payment-flows), and the verification half is in
[signed webhooks](/signed-webhooks). I run [Oullin](https://oullin.io), where event pipelines in
regulated environments are a good chunk of the work. Find me on
[X (@gocanto)](https://x.com/gocanto)._
