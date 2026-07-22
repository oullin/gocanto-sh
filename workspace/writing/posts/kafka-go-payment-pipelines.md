---
title: Exactly-once ends where Kafka does
date: 2026-05-28
updated: 2026-07-22
description: "Kafka and Go pipelines carrying ATM streams, account transactions, and cross-border payments. Partition keys, bounded consumers, inbox and outbox, and why the strongest guarantee in the broker stops at your first external call."
tags: [kafka, go, payments, event-driven]
---

Kafka held every event perfectly. We processed several of them twice.

That is the summary of a week I spent on a payments pipeline at Silverlake, consolidating
three very different streams into one system: ATM telemetry, account transactions, and
cross-border payments. The broker was not the problem at any point. The broker gave us
durable, ordered logs and never once lost anything.

What it does not give you is a partition key, a bounded worker pool, an atomic database
side effect, or an answer to whether replaying a dead-lettered payment is safe. Those are
all yours, and every one of them is where the duplicates came from.

## Three streams, three different invariants

Global ordering is expensive and almost always unnecessary. What matters is ordering for
the entity whose state transitions must not cross.

The three streams did not agree on what that entity was. Account transactions partition by
account ID. A payment lifecycle partitions by payment ID. ATM telemetry mostly does not care,
until you want per-device sequencing for a fault, and then the device is the key.

The key has to be stable, and the failure mode when it is not is sneaky. Partition a payment
by event type and `authorised` and `captured` land on different logs, which turns arrival
order into a race that only shows up under load. Random keys distribute beautifully and
destroy the invariant while looking healthy on every dashboard you own.

Hot keys need an answer decided in advance. One settlement account or one busy merchant can
dominate a partition, and the tempting fix is to change the key, which is the one thing you
cannot casually do. The real options are narrower: split the domain, give the hot workflow
its own topic, or accept that serial processing is the correct price of consistency for that
entity. **Pick one deliberately, because the accidental version is "we changed the key and
lost ordering in production."**

## A goroutine per message is a denial of service you wrote yourself

The easiest Go consumer to write starts a goroutine per message. Under normal load it looks
excellent. It looks excellent right up until something downstream slows down, and then it
converts Kafka lag, which is a queue the broker is happily managing for you, into memory
pressure, database contention, and several thousand requests piled onto the dependency that
was already struggling.

Bound the workers and stop consuming when the local queue is full:

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

That sketch is not sufficient on its own, and the missing part is the one people skip:
partition ordering. Either assign one serial worker per active partition, or coordinate
offsets so a later message cannot commit past an earlier one that failed. A pool that
processes freely across partitions has quietly given up the guarantee you chose your
partition key to get.

Concurrency is a capacity decision, not a knob. Set it from measured downstream limits and
service time, then watch saturation and lag. More workers stop meaning more throughput at
the exact moment it matters most.

## Exactly-once ends where Kafka does

Kafka transactions genuinely give you exactly-once, and the scope of that promise is
precise: consume records and produce records, within Kafka.

They do not atomically charge a provider. They do not atomically update an ordinary
database. They do not unsend an email. The moment your handler touches anything outside the
cluster, you are back to at-least-once and it is your job to make the effect idempotent.

For database-backed services, that means an inbox and an outbox:

1. insert the consumed event ID into an inbox table;
2. apply the domain change;
3. insert resulting events into an outbox;
4. commit all three in one database transaction;
5. publish the outbox separately, then mark it delivered.

A unique constraint on the inbox event ID makes redelivery harmless, which is the whole
point. And note step five is deliberately not in the transaction: the publisher can crash
after publishing and before marking, so it will sometimes send an event twice, and
downstream consumers still have to deduplicate. That is not a flaw in the pattern. It is the
pattern being honest about where the boundary is.

External payment calls need their own idempotency identity on top of all of this. "We have
Kafka exactly-once" is not permission to omit a provider idempotency key, and the failure it
produces is a duplicate charge rather than a duplicate row.

## Dead letters nobody can replay are just a slower delete

A DLQ is only useful if the event carries enough context to diagnose the failure and decide
whether retrying is safe. Ours had to carry:

| Field | Because |
| --- | --- |
| Original topic, partition, offset, event ID | You need to find it again, and prove which one you replayed |
| Schema version and correlation ID | The handler that failed may not be the handler that runs next |
| Named failure class and redacted error | "Failed" is not triage |
| Attempt count, first and last failure time | Distinguishes a blip from a fortnight |
| Handler version that rejected it | The code has moved since |

Transient exhaustion and permanently invalid data are different things and must not share a
retry path. Replaying malformed events into an unchanged consumer is an expensive loop with
a dashboard.

The replay tool supports one event, a bounded set, and a dry run, and it writes a new audit
event recording who replayed what and why. Recovery is a production mutation. It deserves
the controls the original flow has, not a shell script and a Slack message.

## What we actually watched

Consumer lag alone does not describe pipeline health, and lag alarms train people to ignore
alarms. What we tracked instead: arrival and completion rate by event type, age of the
oldest unprocessed event, processing duration versus downstream wait, retry and DLQ rate by
named failure, inbox deduplication count, outbox age and publish attempts, and reconciliation
differences at the payment and ledger boundary.

Alerts were written to represent customer or settlement risk, not queue depth. A small lag on
a quiet audit topic is not the same incident as a growing capture backlog forty minutes
before a settlement cutoff, and an alert that cannot tell those apart will be muted by the
second week.

## Replay is the test of the whole design

The pipeline became trustworthy on the day we could stop it, fix a defect, replay a bounded
window, and then prove that no payment and no ledger entry had been duplicated.

Not argue it. Prove it, from the inbox deduplication counts and the reconciliation report.

Kafka and Go are excellent primitives for this, and neither one gives you the guarantee. It
comes from how partition keys, bounded concurrency, transaction boundaries, external
idempotency, and operator tooling agree with each other. Any one of them disagreeing is a
duplicate charge with a long incubation period.

---

_The idempotency half of this is in [designing idempotent payment
flows](/idempotent-payment-flows), and the verification half is in
[signed webhooks](/signed-webhooks). I run [Oullin](https://oullin.io), where event pipelines
in regulated environments are a good chunk of the work. Find me on
[X (@gocanto)](https://x.com/gocanto)._
