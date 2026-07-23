---
title: The AS/400 was not the problem
date: 2026-05-14
updated: 2026-07-22
description: "Modernising a VCOS banking core on AS/400 without replacing it: a Go reverse proxy and multi-protocol ingress, ambiguity as a first-class state, and a monitoring console built before any traffic moved."
tags: [as400, banking, go, modernisation]
---

The first thing I shipped at a bank running a decades-old core was a dashboard.

Not a service, not a migration, not the Go layer everyone was waiting for. A console
showing ATM low-level processes, CPU and daemon health, core configuration snapshots, and
the state of every channel and host interface. It felt like a detour for about a week, and
then it was the only reason anyone could agree on what to do next.

This was Silverlake, on a VCOS core: C and AS/400, wired into a bank's daily reality. The
brief was modernisation. The thing worth writing down is what we did not do, which was
replace it.

## The core was old and it was correct

A banking core can be thirty years old and still be the most reliable component in the
building.

The VCOS application in the middle of that bank held decades of posting rules, end-of-day
behaviour, product exceptions, and operational knowledge that existed nowhere else in
writing. Nobody could tell you every rule. The system could, and it had been right about
them for longer than most of the team had been working.

The instinct to replace it comes from the interface, not the domain. It is hard to
integrate with, so it feels obsolete. Those are different problems, and confusing them is
how a two-year rewrite starts.

The core did not need replacing. It needed a boundary.

## The boundary is the product, not a translation layer

The modern layer is not thin. If it is thin, you have built an HTTP wrapper around your
problems and moved them into a nicer language.

It owns everything the core was never designed to give web, mobile, and event-driven
consumers: authentication and authorisation, request validation, stable domain contracts,
rate limits, timeouts, circuit breakers, caching where the business semantics allow it,
correlation IDs and an audit record for every call, and protocol adaptation across HTTP,
Kafka, Redis Streams, and RabbitMQ, because different parts of the bank arrived over
different transports and none of them were going to change for us.

I wrote it in Go. The concurrency model is explicit, the deployment artifact is small, and
the standard library covers most network work without an argument about frameworks. But the
language was the least important decision. The rule that mattered was that the boundary owns
one vocabulary:

```go
type AccountCore interface {
    Balance(ctx context.Context, accountID AccountID) (Money, error)
    Post(ctx context.Context, command PostingCommand) (PostingResult, error)
}
```

Deliberately boring. A caller should never need to know whether a balance came from
DB2/400, a C service, or a read model rebuilt off Kafka. The difficult details live in
adapters. The domain service gets stable types and named failures, and that is the entire
trick.

## "Unknown" is a state, and it belongs in the type

Legacy integrations fail ambiguously, and ambiguity is where money goes missing.

A socket can close after the core has committed a posting and before your caller sees the
response. Retry blindly and you have moved the money twice. Return a generic error and the
operation sits unresolved while a customer looks at a balance that is wrong in a way nobody
can explain.

So every mutating command carries a stable operation identity, recorded before the call, and
retries resolve against that identity rather than against hope. Outcomes are not success and
failure. They are success, failure, and **unknown: reconcile before retrying**, which is a
real state with real handling and not a comment next to an enum.

Timeouts got the same treatment. A timeout is a budget, not a default copied between
services. If a request has two seconds left, an adapter cannot spend five in its own retry
loop, so the deadline is passed down and time is reserved for a controlled answer instead of
a truncated one.

Circuit breakers protect the core from synchronised retry storms, but tripping is the easy
part. The response has to tell the caller whether to retry, queue, or stop, and operations
has to know which dependency opened it. A breaker that only protects the core has moved the
outage rather than contained it.

## Which brings us back to the dashboard

You cannot decide whether a cutover is safe from a design document.

Before any traffic moved, reads were mirrored through the new boundary and compared against
the established path. Latency, result differences, error classifications, and the calls the
new contract could not yet express, all recorded. Writes started as audit-only observation,
then a bounded subset where reconciliation was already strong enough to catch us.

What had to be on the screen before anyone would sign off:

| Signal | Answers |
| --- | --- |
| Volume and latency by operation | Is the boundary carrying what we think it is |
| Core response codes mapped to named domain errors | Do we understand the failures yet |
| Circuit state, timeout rate, retry count | Are we protecting the core or hammering it |
| Old versus new read mismatches | Is the new path actually equivalent |
| Unresolved operations awaiting reconciliation | How much ambiguity are we carrying |
| Consumer lag and failure by downstream | Who breaks when we move |

That is not monitoring bolted on after delivery. It is the evidence used to decide whether
the next step is allowed. The console ended up a Vue and TypeScript real-time system with a
tree-based exploration model and a widget SDK, and moving it to Vite cut roughly 30% of our
CI minutes as a side effect. Useful, but not the point. The point was that "is it safe to
move ATM traffic" became a question with an answer.

## One capability at a time, with a route back

The sequence we actually ran, with a five-engineer squad, over months rather than weeks:

1. Inventory the operations and define the modern contract.
2. Put read-only traffic through the boundary.
3. Shadow and compare the high-value reads.
4. Introduce idempotent writes for one bounded workflow.
5. Publish durable events from confirmed core outcomes.
6. Move consumers gradually, behind feature flags.
7. Retire the old path only after a full reconciliation window.

Every step needed an explicit rollback trigger agreed in advance, and an actual route back.
"We can redeploy the old version" stops being true the moment schemas, events, or downstream
state have moved, and the honest time to discover that is while writing the step, not during
it.

Docker multi-stage releases with automated rollout and rollback made the mechanics boring
enough that reverting was a decision rather than an incident.

## Modernisation worked when the core got boring

The goal was never to hide the AS/400 and declare a transformation.

It was to make it one well-behaved dependency among others: bounded by contracts, protected
from load, visible to operators, and replaceable capability by capability if the bank ever
decides that is worth doing. Nobody needed to know it was there, and nobody needed to
pretend it was not.

That is slower to describe than "rewrite it" and much faster to operate safely. The valuable
part of the old system survives, every new integration gets modern guarantees, and the
rewrite conversation becomes optional rather than existential.

The part I would press on anyone starting this: build the dashboard first. Not because
observability is a virtue, but because every argument you are about to have is really an
argument about what production is doing, and only one of you will have the numbers.

---

_Related: [the two seconds nobody asked for](/cut-api-latency-two-seconds-to-100ms) on the
measurement half of this, and [signed webhooks](/signed-webhooks) on the boundary half. I run
[Oullin](https://oullin.io), where legacy modernisation in regulated environments is a large
part of the work. Find me on [X (@gocanto)](https://x.com/gocanto)._
