---
title: The two seconds nobody asked for
date: 2026-07-02
updated: 2026-07-22
description: "An API path at two seconds, a database doing three. It ended at 100ms, and almost none of it came from making queries faster. It came from deleting work the request never needed to do."
tags: [performance, sql, caching, slos]
---

The endpoint took two seconds and the database underneath it took three.

That arithmetic should bother you, and it bothered me. A request cannot be slower than its
own database work and also faster than it, so either the profile was lying or the request
was not really waiting for all of that work. It was the second thing, in the least helpful
way: part of those three seconds belonged to a different caller warming the same rows.

This was a business banking product at Aspire Financial Technologies, on transaction paths
customers hit constantly and complained about politely. It ended at roughly 100ms on the
API and 800ms on the heaviest database work. The interesting part is not the ratio. It is
that almost none of the improvement came from making a query faster.

## "The API is slow" is not a measurement

The first day produced no code. It produced a number I could argue with.

One route, one representative workload, and then p50, p95, p99, payload size, query count,
rows read, external calls, CPU time, and time spent waiting on the connection pool. Spans
around each, so the missing milliseconds had nowhere to hide between two log lines.

Two things about that setup mattered more than the tooling.

**Use production-shaped data.** A query that scans 200 rows on a laptop scans twenty
million in the tenant that files the ticket. Copy statistics rather than records and the
planner makes production decisions against data you are allowed to have.

**Separate cold from warm.** Our averages looked respectable because the pool and the
caches were always hot by the time anyone measured. The first customer after a quiet Sunday
still waited seconds, and no dashboard I owned had an opinion about it.

## The problem was the number of queries, not the queries

The count came back in the hundreds for a single page of transactions. Not one slow
statement: several hundred fast ones, which is a more embarrassing result, because every
individual query looks fine in the slow log.

They came from the usual places, and one specific place:

- related records loaded inside a serializer loop
- the same tenant and configuration resolved over and over
- full ORM models hydrated for responses that used four columns
- count and data queries running with different filters
- **a permission check that queried once per row in the result set**

That last one is why the fix ended up architectural rather than local. Authorisation was
scattered through the codebase as whatever check happened to be nearest, so a list endpoint
paid for it per item and there was nowhere to go to make it cheaper. Centralising
permissions behind an authorisation gateway turned it into a bounded, cacheable answer
computed once per request instead of a query multiplied by page size.

**The best query optimisation available was going from four hundred round trips to four.**

## Then, and only then, `EXPLAIN ANALYZE`

With the count under control, the statements that remained were worth reading properly,
with realistic parameters rather than the tidy ones that make plans look good.

What I read for: estimated rows diverging sharply from actual, sequential scans on
predicates that should have been selective, sorts spilling to disk, nested loops multiplying
two large inputs, and functions wrapped around columns quietly disqualifying an index.

```sql
CREATE INDEX CONCURRENTLY payments_account_created_idx
    ON payments (account_id, created_at DESC)
    INCLUDE (status, amount, currency);
```

That one supports an account timeline in the order it is actually read, and carries the
projected columns so the database does not go back to the heap for them. It is not a
template. Write cost, cardinality, and retention all argue against indexes, and an index
that exists because a column appeared in a `WHERE` clause is a maintenance bill with no
matching benefit.

Pagination went the same way. Deep offsets ask the database to find and discard everything
before the page you want, so page 200 is slow by design. A keyset cursor over
`(created_at, id)` keeps the work per page constant no matter how far in the customer is.

## Caching came last, and that ordering was the point

Every earlier attempt at this problem had started with a cache, which is exactly why the
problem was still there. A cache in front of an inefficient query hides the inefficiency,
makes invalidation harder to reason about, and converts a latency bug into a correctness bug
you find months later.

Once the access path was controlled, caching had something worth caching: reference data,
computed permissions with a version, read models updated from durable events. Things with an
owner and a tolerable staleness window.

Two rules I would not bend on.

**The key carries the tenant and the policy version.** A cache key that omits the
authorisation context is not a performance optimisation, it is a data leak waiting for
enough concurrency.

**Protect the miss.** One expired hot key should not send four hundred identical queries at
the database. Single-flight, jittered TTLs, or background refresh, but something.

Caching "not found" needs its own thought. Hold it too long and you hide a record created
seconds ago, which reads to a customer as the system losing their money.

## Where the missing 700ms went

Back to the arithmetic. The heaviest database work still takes around 800ms in its worst
shape, and the API answers in about 100.

That gap is not a trick. It is the whole answer: **the work left the request path.** What a
customer waits for is now a bounded read against a shape built for reading. The expensive
aggregation still happens, but it happens on a schedule or off an event, and nobody sits
with a spinner while it does.

Running alongside that, the monolith to microservices migration halved the critical paths on
its own, 3s to 1.5s, mostly by removing hops and contention that had nothing to do with SQL.

The framing that survived all of it: latency is a budget. Every request is allowed to create
a certain amount of work, and the design either enforces that or it does not.

## Then hold it

A one-off benchmark is a screenshot. It decays the moment somebody adds a join.

So it became an SLO with an error budget, alerting on the budget rather than on individual
slow requests, plus limits written into the API contract itself: a maximum page size,
bounded date ranges, explicit expansions. Returning every transaction because the endpoint
technically can is not flexibility. It is an unbounded cost you have agreed to pay forever.

<!-- NEED: the real SLO thresholds, if they are shareable. Right now this section describes
the shape without the numbers, and the numbers are what make it evidence. -->

The check that mattered most was the cheapest: query count and rows scanned, asserted in
integration tests on the critical paths. When a feature reintroduces an N+1, the build says
so, instead of a customer discovering it eight months later on the tenant with twenty
million rows.

## What I would take from this

Nothing here was clever. That is the honest summary of a twentyfold improvement.

- **Measure the whole path before touching anything.** The two-versus-three-seconds
  contradiction was the most useful thing I found all week, and it came from arithmetic, not
  tooling.
- **Count queries before tuning queries.** Hundreds of fast statements ruin a request more
  reliably than one slow one, and none of them appear in a slow query log.
- **Cache last.** A cache in front of a bad access path is a bug you have agreed to pay
  interest on.
- **Move work off the request path rather than speeding it up.** The 800ms did not
  disappear. It stopped being something a customer waits for.
- **Put the budget in the contract and in the test suite.** Otherwise you will do this again
  in two years, on the same endpoint, with a different team.

The uncomfortable part is that the two seconds had been there long enough to feel like a
property of the domain. Banking is slow, transaction lists are heavy, that is just how it
is. None of that was true. It was a permission check in a loop.

---

_Same instinct as [signed webhooks](/signed-webhooks) and
[deleting a feature](/deleting-a-feature-is-a-graph-problem): the behaviour you get is a
property of the design, not of the individual functions. I run [Oullin](https://oullin.io),
where production hardening of this kind is most of the work. Find me on
[X (@gocanto)](https://x.com/gocanto)._
