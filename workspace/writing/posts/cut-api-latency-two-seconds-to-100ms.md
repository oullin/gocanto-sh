---
title: How to cut API latency from two seconds to 100 milliseconds
date: 2026-07-22
updated: 2026-07-22
description: "A measurement-first account of reducing a production API path from roughly two seconds to about 100 milliseconds through query profiling, bounded data access, caching, and SLOs."
tags: [performance, sql, caching, slos]
expertise: https://gocanto.sh/expertise/payment-systems
expertiseLabel: high-stakes backend architecture
---

The fastest optimization was deleting work the request never needed to do.

On a production financial path I worked on, API latency sat around two seconds and the underlying
database work could take roughly three. After profiling and changing the shape of the operation, the
API path landed around 100 milliseconds and the key queries around 800 milliseconds in their
heavier form.

The useful part of that result is not the percentages. It is the order of operations: measure the
whole path, remove unnecessary work, make database access explicit, cache only stable answers, and
set an SLO so the gain survives the next feature.

## Define the request you are optimizing

“The API is slow” is not a measurement.

Pick one route and one representative workload. Record p50, p95, and p99 latency, payload size,
query count, rows read, external calls, CPU time, and time waiting for the connection pool. Break the
trace into spans so the missing time cannot hide between application logs.

Use production-shaped data. A query that scans 200 rows locally can scan 20 million in the real
tenant. Copy statistics or generate representative volume without copying sensitive records.

I also separate cold and warm behaviour. A cache or connection warm-up can make an average look
excellent while the first customer after a quiet period still waits seconds.

## Count queries before tuning queries

An N+1 path can execute individually fast statements and still be slow as a request. Instrument the
query count and attach it to the trace.

Common sources include:

- loading related records inside a serializer loop;
- permission checks that query once per result;
- resolving the same tenant or configuration repeatedly;
- fetching complete ORM models when the response uses four columns;
- running count and data queries with different filters.

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
bounded.

## Cache a domain answer, not an accident

Caching helped once the underlying query path was controlled. Before that, it only hid inefficient
work and made invalidation harder to reason about.

Choose entries with clear ownership and a tolerable freshness window: reference data, computed
permissions with a version, or read models updated from durable events. Include tenant and relevant
policy versions in the key. A cache key that omits authorization context is a data leak waiting for
load.

Protect the miss path from a stampede. Use single-flight work, short randomized TTLs, or background
refresh so one expired key does not send hundreds of identical queries to the database.

Negative results need care. Caching “not found” for too long can hide a record created seconds later.

## Keep response work bounded

Database improvements can reveal application overhead that was previously invisible. Profile JSON
serialization, large object mapping, compression, and repeated policy evaluation.

Put limits into the API contract: maximum page size, bounded date ranges, and explicit expansions.
Returning every transaction because the endpoint technically can is not flexibility; it is an
unbounded production cost.

## Turn the result into an SLO

A one-off benchmark is easy to lose. Define a service-level objective for the route and alert on the
error budget, not a single slow request.

For example:

- 95% of requests below 200 ms over 28 days;
- 99% below 500 ms;
- error rate below the agreed threshold;
- query count and rows scanned guarded in integration tests for critical paths.

Add a performance check for the query shape and retain tracing in production. When a feature adds a
join or removes a filter, the team should see the budget move before customers rediscover the old
latency.

## Performance is a property of the design

The improvement came from making the request smaller and more predictable: fewer round trips,
better access paths, bounded results, correctly scoped caching, and an operational target.

That is more durable than a collection of database tricks. The system knows how much work one
request is allowed to create, and the team has evidence when that contract starts to drift.
