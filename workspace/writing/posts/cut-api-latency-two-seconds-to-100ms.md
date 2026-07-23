---
title: How to cut API latency from two seconds to 100 milliseconds
date: 2026-07-02
updated: 2026-07-23
description: "A measurement-first account of reducing a production API path from roughly two seconds to about 100 milliseconds through query profiling, bounded data access, caching, and SLOs."
tags: [performance, sql, caching, slos]
---

The fastest optimization was deleting work the request never needed to do.

On a business banking product at Aspire Financial Technologies, latency on the transaction paths
sat around two seconds while the underlying database work could take roughly three. That
arithmetic was itself a finding: a request cannot be slower than its own database work and also
faster than it, and the profile only made sense once it was clear that part of those three seconds
belonged to a different caller warming the same rows. After profiling and changing the shape of the
operation, the API path landed around 100 milliseconds and the key queries around 800 milliseconds
in their heavier form.

The useful part of that result is not the percentages. It is the order of operations: measure the
whole path, remove unnecessary work, make database access explicit, cache only stable answers, and
set an SLO so the gain survives the next feature.

## Define the request you are optimizing

"The API is slow" is not a measurement.

Pick one route and one representative workload. Record p50, p95, and p99 latency, payload size,
query count, rows read, external calls, CPU time, and time waiting for the connection pool. Break the
trace into spans so the missing time cannot hide between application logs.

Use production-shaped data. A query that scans 200 rows locally can scan 20 million in the real
tenant. Copy statistics or generate representative volume without copying sensitive records.

I also separate cold and warm behaviour. A cache or connection warm-up can make an average look
excellent while the first customer after a quiet period still waits seconds.

## Count queries before tuning queries

An N+1 path can execute individually fast statements and still be slow as a request. Instrument the
query count and attach it to the trace. On this system the count came back in the hundreds for a
single page of transactions: not one slow statement, but several hundred fast ones, none of which
appear in a slow query log.

Common sources include:

- loading related records inside a serializer loop;
- permission checks that query once per result;
- resolving the same tenant or configuration repeatedly;
- fetching complete ORM models when the response uses four columns;
- running count and data queries with different filters.

The permission check was the expensive one here, and the fix ended up architectural rather than
local. Authorization was scattered through the codebase as whatever check happened to be nearest,
so a list endpoint paid for it once per row and there was no single place to make it cheaper.
Centralizing permissions behind an authorization gateway turned the check into a bounded, cacheable
answer computed once per request instead of a query multiplied by page size.

Remove duplication first. Batch related keys, preload bounded relations, and select the fields the
contract needs. The best query optimization is often going from 400 round trips to four.

## Read the actual execution plan

For the remaining expensive statements, use `EXPLAIN ANALYZE` against realistic parameters.

Look for estimates that diverge sharply from actual rows, sequential scans on selective predicates,
sorts spilling to disk, nested loops multiplying large inputs, and functions that prevent index use.
An index is useful when it supports the real filter and order, not because the column appears in a
where clause.

```sql
CREATE INDEX CONCURRENTLY payments_account_created_idx
    ON payments (account_id, created_at DESC)
    INCLUDE (status, amount, currency);
```

That example supports a common account timeline without forcing the database back to the table for
the projected fields. It is not a universal index: write cost, cardinality, and retention still
matter.

Pagination also needs a stable shape. Deep offset pagination asks the database to find and discard
all earlier rows. Keyset pagination over a deterministic `(created_at, id)` cursor keeps the work
bounded no matter how far in the customer pages.

## Cache a domain answer, not an accident

Caching helped once the underlying query path was controlled. Before that, it only hid inefficient
work and made invalidation harder to reason about. Earlier attempts at this problem had started
with a cache, which is part of why the problem was still there.

Choose entries with clear ownership and a tolerable freshness window: reference data, computed
permissions with a version, or read models updated from durable events. Include tenant and relevant
policy versions in the key. A cache key that omits authorization context is a data leak waiting for
load.

Protect the miss path from a stampede. Use single-flight work, short randomized TTLs, or background
refresh so one expired key does not send hundreds of identical queries to the database.

Negative results need care. Caching "not found" for too long can hide a record created seconds later.

## Move the remaining work off the request path

The heaviest database work still takes around 800 milliseconds in its worst shape, and the API
answers in about 100. The gap is not a trick. The expensive aggregation still happens, but on a
schedule or off an event, so what a customer waits for is a bounded read against a shape built for
reading.

In parallel, a monolith-to-microservices migration halved the critical paths on its own, from
roughly three seconds to 1.5, mostly by removing hops and contention that had nothing to do with
SQL.

## Keep response work bounded

Database improvements can reveal application overhead that was previously invisible. Profile JSON
serialization, large object mapping, compression, and repeated policy evaluation.

Put limits into the API contract: maximum page size, bounded date ranges, and explicit expansions.
Returning every transaction because the endpoint technically can commits the system to an unbounded
production cost.

## Turn the result into an SLO

A one-off benchmark is easy to lose. Define a service-level objective for the route and alert on the
error budget, not a single slow request.

For the transaction-list paths the objective was p95 under 200 milliseconds and p99 under 500
milliseconds, measured at 99.9% over a rolling 28-day window. That leaves a 0.1% error budget,
about forty minutes across the window. Burning it fast paged someone; burning it slow froze
non-critical deploys until the budget recovered.

Query count and rows scanned are also guarded in integration tests on the critical paths, and
tracing stays on in production. When a feature adds a join or reintroduces an N+1, the build says
so, instead of a customer discovering it months later on the tenant with twenty million rows.

## Performance is a property of the design

The improvement came from making the request smaller and more predictable: fewer round trips,
better access paths, bounded results, correctly scoped caching, and an operational target.

That is more durable than a collection of database tricks. The system knows how much work one
request is allowed to create, and the team has evidence when that contract starts to drift. The two
seconds had been in place long enough to look like a property of the domain, but most of it was a
permission check running once per row.

---

_The same design-over-functions point comes up in [signed webhooks](/signed-webhooks) and
[deleting a feature](/deleting-a-feature-is-a-graph-problem). I run [Oullin](https://oullin.io),
where production hardening of this kind is most of the work. Find me on
[X (@gocanto)](https://x.com/gocanto)._
