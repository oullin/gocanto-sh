---
title: Money in Go, done properly
date: 2025-12-15
updated: 2026-07-27
description: "Using currency-aware values, integer minor units, explicit rounding, and stable boundary formats to keep monetary arithmetic and storage predictable in Go."
tags: [go, money, payments]
---

Money needs more structure than a floating-point number. An amount without its currency is ambiguous, and binary floating-point is the wrong representation for values that must reconcile to a cent.

[`gocanto/money`](https://github.com/gocanto/money) applies Martin Fowler's Money pattern to Go: a value contains an integer amount in minor units and a currency, while a manager performs validated arithmetic. The corresponding PHP concerns are covered in [Handling money in PHP](/handling-money-in-php).

## Installation and representation

The repository currently requires Go 1.25.5:

```sh
go get github.com/gocanto/money
```

An amount of `10000` in USD means $100.00 because USD has two fractional digits:

```go
manager := money.NewManager()

price := manager.Create(10000, currency.USD)
tax := manager.Create(850, currency.USD)

total, err := manager.Add(price, tax)
if err != nil {
    return err
}

display, err := total.Display()
if err != nil {
    return err
}

fmt.Println(display) // $108.50
```

Using minor units avoids floating-point arithmetic in the domain. It does not remove the need to define rounding at every boundary, especially when converting currencies or accepting decimal input.

## Arithmetic and allocation

The manager rejects arithmetic across different currencies:

```go
usd := manager.Create(100, currency.USD)
eur := manager.Create(100, currency.EUR)

_, err := manager.Add(usd, eur)
if err != nil {
    // Convert explicitly or reject the operation.
}
```

Splitting also needs a deterministic remainder rule. The library assigns the leftover minor units rather than discarding them:

```go
invoice := manager.Create(10000, currency.USD)

parts, err := manager.Split(invoice, 3)
if err != nil {
    return err
}

// 3334, 3333, 3333 minor units.
```

Ratio allocation is available through `Allocate`. Its result should still be tested against the business rule that selected the ratios; a library cannot decide that rule for you.

## Parse once at the boundary

For exact decimal text, use the string constructor:

```go
amount, err := manager.CreateFromString("99.99", currency.USD)
if err != nil {
    return err
}
```

The separate `parser` package recognizes symbols, currency codes, and localized separators. Its regular `ParseAmount` method returns a `float64`, while `ParseAmountWithDecimalComma` handles comma-decimal input. That makes the parser useful for interpreting user input, but the result still needs an explicit conversion policy. Do not let a parsed float become the stored representation.

## Stable API and storage contracts

The current JSON representation is a minor-unit amount plus a currency code:

```json
{ "amount": 2999, "currency": "USD" }
```

That is a suitable wire shape because it does not ask consumers to infer units from `29.99`. Keep the same contract in events and queues.

The library implements `sql.Scanner` and `driver.Valuer` using a delimited single-column representation. That can be convenient for an existing schema. For a schema you control, two explicit columns are easier to query and constrain:

```sql
amount_minor BIGINT NOT NULL,
currency_code CHAR(3) NOT NULL
```

The database contract and display contract should remain separate. Store `2999` and `USD`; format `$29.99` at the edge.

## Currency conversion

The package includes an in-memory exchange-rate store and converter. Rates are accepted as `float64`, so the application must own the rate source, timestamp, precision, and rounding policy. A converted amount without those facts is not auditable.

For payments, also record the original amount, converted amount, rate identifier, and time used. The Money value prevents currency-free arithmetic; it does not provide an accounting ledger.

## Practical rules

- Keep minor units and currency together.
- Reject cross-currency arithmetic unless a conversion is explicit.
- Parse external text once and validate it at the boundary.
- Use `Split` or `Allocate` when distributing remainders.
- Put integer minor units and currency codes on storage and wire boundaries.
- Treat formatting as presentation, never as the source of truth.

These rules matter more than the choice of package. The package earns its place by making the rules harder to bypass.
