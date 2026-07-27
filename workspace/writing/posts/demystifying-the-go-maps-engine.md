---
title: Demystifying the Go map
date: 2025-11-22
updated: 2026-07-27
description: "How Go's current Swiss-table map implementation organizes control bytes, groups, probing, and growth, and how it differs from the older bucket design."
tags: [go, runtime, data-structures]
---

The implementation behind Go's built-in `map` changed in Go 1.24. Articles that describe an
`hmap`, eight-entry buckets, overflow chains, and incremental bucket evacuation describe the
older runtime, not the map a current Go program uses.

Go now uses a design based on Swiss Tables. The language-level contract did not change:
lookups, assignments, deletion, comparability rules, and deliberately unspecified iteration
order still behave as Go defines them. The implementation changed how the runtime finds and
stores entries.

The best source is the runtime itself:
[`internal/runtime/maps/map.go`](https://go.dev/src/internal/runtime/maps/map.go).

## Groups, slots, and one control word

A table is divided into groups. Each group contains eight key/value slots and an eight-byte
control word. One control byte describes each slot:

- whether the slot is empty, deleted, or occupied;
- for an occupied slot, seven low bits from the key's hash, called `H2`.

The rest of the hash, `H1`, chooses where probing begins. A lookup compares the requested
`H2` with the control bytes for all eight slots in a group. Bit operations produce the set of
possible matches before the runtime performs the more expensive full key comparisons.

That is the main Swiss-table idea: inspect metadata for a group in one operation, then touch
only the key slots that might match.

```text
control: [h2][h2][empty][h2][deleted][empty][h2][h2]
slots:   [k/v][k/v][     ][k/v][       ][     ][k/v][k/v]
```

An `H2` match is only a candidate. Different keys can share those seven bits, so Go still
uses the key type's equality operation before returning a value.

## Lookup stops at an empty slot

If the first group contains no matching candidate, the table follows its probe sequence to
another group. It continues past occupied and deleted slots. A truly empty slot terminates
the search because an entry following the same probe sequence could not have been inserted
beyond that point.

Deleted slots are therefore different from empty slots. A deletion leaves a tombstone where
needed so future lookups do not stop too early.

The lookup path in
[`table.go`](https://go.dev/src/internal/runtime/maps/table.go) documents those rules next to
the code that selects candidates and compares keys.

## A map can contain more than one table

Small maps begin with a compact representation. As a map grows, the runtime can replace a
table with a larger table or split it into two tables. The top-level map keeps a directory of
tables, and upper hash bits select the relevant table.

This differs from the old design's array of buckets and overflow buckets. It also means old
load-factor explanations should not be carried forward as if they describe current Go.

Iteration still has to satisfy the language's rules while growth occurs. That constraint is
one reason implementation details around replacement and splitting are more involved than a
standalone hash-table example.

## What an application should depend on

These internals are useful when reading profiles, understanding allocation changes after a Go
upgrade, or contributing to the runtime. They are not an API contract.

Application code should depend on the language guarantees and measure its own workload.
Pre-sizing a map when the eventual size is known can still avoid work. Choosing comparable,
compact keys can still matter. But code should not assume a specific group size, probe
sequence, memory layout, or growth threshold will remain unchanged.

The older bucket design was a useful engineering solution. Swiss Tables are the current one.
Knowing which generation an explanation refers to is more important than memorizing either
layout.
