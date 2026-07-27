---
title: Laravel collections in Go
date: 2026-03-31
updated: 2026-07-27
description: "How a Go collections package adapts Laravel's fluent pipelines to generics, immutable transformations, and iter.Seq without hiding ordinary slice operations."
tags: [go, collections, generics]
---

Laravel's [Collections API](https://laravel.com/docs/collections) makes common transformations easy to compose. [`gocanto/collection`](https://github.com/gocanto/collection) explores the same interface in Go, using generics for type safety and `iter.Seq` for deferred iteration.

It is an option for pipelines with several named transformations. A direct `for` loop remains clearer for many short operations.

## The basic collection

The current module requires Go 1.25:

```sh
go get github.com/gocanto/collection
```

Its core package wraps a slice in `Collection[T]`:

```go
numbers := collection.Collect([]int{1, 2, 3, 4, 5, 6})

even := numbers.
    Filter(func(value int, _ int) bool {
        return value%2 == 0
    }).
    Take(2)

fmt.Println(even.All()) // [2 4]
```

Transformations return new collections, so this pipeline does not modify `numbers`. That behaviour is verified in the package tests and is the main semantic difference from helpers that mutate a slice in place.

## Why `Map` is a function

Go methods cannot introduce their own type parameters. A method on `Collection[int]` therefore cannot declare a new result type such as `string`. The package exposes type-changing operations as generic functions:

```go
labels := collection.Map(even, func(value int, _ int) string {
    return strconv.Itoa(value)
})
```

This is not an imitation of Laravel's method surface. It is the constraint that keeps the result type known at compile time.

## The packages that actually exist

The repository currently separates five concerns:

- `collection` provides the fluent slice wrapper;
- `lazy` builds deferred pipelines on `iter.Seq`;
- `collectible` provides ordered key-value operations;
- `arr` contains standalone slice helpers; and
- `kv` contains map helpers, including dot-notation access.

Use the smallest package that matches the job. Pulling a fluent collection into a single `Contains` check adds ceremony without making the code clearer.

## Lazy evaluation

The `lazy` package defers work until the sequence is consumed. That can help when input is generated incrementally or when `Take` should stop upstream work early.

It does not make a transformation fast by definition. Allocation, callback cost, and access patterns still determine performance. Measure the real pipeline before replacing a slice loop, especially on a hot path.

The package documentation includes the current constructors and terminal operations in its [lazy reference](https://github.com/gocanto/collection/blob/main/docs/lazy.md). Checking that reference matters because the lazy API changed after the first version of this article.

## Where it fits

A collection is useful when a chain tells the story better than its loops:

```go
active := collection.Collect(accounts).
    Filter(isActive).
    Reject(isSuspended).
    Take(limit)
```

Keep an ordinary loop when it needs early returns, accumulates several results, or carries domain-specific state. Fluent syntax should expose the operation, not conceal it.

The practical test is simple: can a reader understand allocation, ordering, and failure behaviour from the call site? If the chain makes those facts less visible, the loop is the better Go.
