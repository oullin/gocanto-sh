---
title: How to modernise an AS/400 banking core without replacing it
date: 2026-05-14
updated: 2026-07-23
description: "A low-risk pattern for modernising an AS/400 banking core with a Go boundary, explicit resilience controls, observable traffic, reconciliation, and reversible cutovers."
tags: [as400, banking, go, modernisation]
---

A banking core can be old and still be correct.

That distinction matters. The AS/400 or VCOS application in the middle of a bank may contain
decades of tested posting rules, end-of-day behaviour, product exceptions, and operational
knowledge. Replacing it because the interface is difficult confuses an integration problem with a
domain problem.

The system in my case was Silverlake, on a VCOS core: C and AS/400, wired into a bank's daily
operations. The brief was modernisation. I have had better results modernising the surface first:
put a controlled boundary around the core, make every interaction observable, and move capabilities
a slice at a time. The core keeps doing what it already does well while new systems get contracts
they can safely build against.

## Start with the boundary, not the rewrite

The modern layer is not a thin HTTP translation. It owns the concerns the legacy core was never
designed to provide to web, mobile, and event-driven consumers:

- authentication and authorisation;
- request validation and stable domain contracts;
- rate limits, timeouts, and circuit breakers;
- caching where the business semantics allow it;
- correlation IDs and an audit record for every call;
- protocol adaptation across HTTP, Kafka, Redis Streams, and RabbitMQ, because different parts of
  the bank arrived over different transports and none of them were going to change for us.

I wrote this layer in Go. The concurrency model is explicit, the deployment artifact is small, and
the standard library is enough for most network work. More important than the language is the rule
that the boundary owns one vocabulary. Callers should not need to know whether a balance came from
DB2/400, a C service, or a Kafka-backed read model.

```go
type AccountCore interface {
    Balance(ctx context.Context, accountID AccountID) (Money, error)
    Post(ctx context.Context, command PostingCommand) (PostingResult, error)
}

type AccountService struct {
    core    AccountCore
    audit   AuditWriter
    breaker CircuitBreaker
}
```

That interface is deliberately boring. The difficult details stay in adapters; the domain service
gets stable types and named failures.

## Make failure behaviour part of the contract

Legacy integrations often fail ambiguously. A socket can close after the core committed a posting
but before the caller received the response. Retrying blindly can duplicate money movement;
returning a generic error leaves the operation unresolved while a customer looks at a balance
nobody can explain.

Every mutating command therefore needs a stable operation identity. The boundary records the
request before calling the core and resolves retries against that identity. Outcomes are not only
"success" and "failure"; they include "unknown, reconcile before retry," which is a real state with
real handling.

Timeouts must also be budgets, not defaults copied across services. If a request has two seconds
remaining, an adapter cannot spend five seconds in its own retry loop. Pass the deadline down and
reserve time for a controlled response.

Circuit breakers protect the core from synchronized retry storms, but opening a breaker is not the
end of the design. The response must tell callers whether to retry, queue, or stop, and operations
must know which dependency tripped it.

## Observe before moving traffic

The safest migration begins by learning what production actually does.

On this project, the first thing I shipped was the monitoring console, before any of the Go layer
carried traffic. It showed ATM low-level processes, CPU and daemon health, core configuration
snapshots, and the state of every channel and host interface. It felt like a detour for about a
week, and then it became the evidence the team used to agree on every traffic step that followed.

Mirror reads through the new boundary and compare them with the established path. Record latency,
result differences, error classifications, and calls the new contract cannot yet express. For
writes, start with audit-only observation or a controlled subset where reconciliation is already
strong.

The dashboard I want before cutover includes:

- request volume and latency by operation;
- core response codes translated into named domain errors;
- circuit state, timeout rate, and retry count;
- mismatches between old and new read paths;
- unresolved operations waiting for reconciliation;
- lag and failure rates for every downstream event consumer.

This is not monitoring added after delivery. It is the evidence used to decide whether the next
traffic step is safe. The console itself grew into a real-time Vue and TypeScript application with
a tree-based exploration model and a widget SDK, and moving its build to Vite cut roughly 30% of
our CI minutes as a side effect.

## Move one capability at a time

The sequence we ran, with a five-engineer squad, over months rather than weeks:

1. Inventory operations and define the modern contract.
2. Put read-only traffic through the boundary.
3. Shadow and compare high-value reads.
4. Introduce idempotent writes for one bounded workflow.
5. Publish durable events from confirmed core outcomes.
6. Move consumers gradually behind feature flags.
7. Retire the old path only after a full reconciliation window.

Every step needs an explicit rollback trigger agreed in advance, and an actual route back. "We can
redeploy the old version" is not enough if schemas, events, or downstream state have already moved,
and the honest time to discover that is while writing the step, not during it.

Docker multi-stage releases with automated rollout and rollback made reverting cheap enough that it
stayed a decision rather than an incident.

## Modernisation is successful when the core becomes uninteresting

The goal is not to hide the AS/400 and declare victory. It is to make the core one well-behaved
dependency among others: bounded by contracts, protected from load, visible to operators, and
replaceable capability by capability if the business later chooses.

That approach is slower to describe than "rewrite it," but much faster to operate safely. The
valuable part of the old system survives while every new integration gets the modern guarantees it
actually needs. If I could press one thing on anyone starting this work, it would be to build the
dashboard first: most of the arguments ahead are really arguments about what production is doing,
and the numbers settle them.

---

_Related: [cutting API latency from two seconds to 100ms](/cut-api-latency-two-seconds-to-100ms)
covers the measurement side of this work, and [signed webhooks](/signed-webhooks) covers the
boundary side. I run [Oullin](https://oullin.io), where legacy modernisation in regulated
environments is a large part of the work. Find me on [X (@gocanto)](https://x.com/gocanto)._
