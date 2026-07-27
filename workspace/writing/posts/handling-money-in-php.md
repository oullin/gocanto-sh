---
title: Handling money in PHP
date: 2025-12-05
updated: 2026-07-27
description: "Using MoneyPHP, integer minor units, explicit currencies, and separate storage and display boundaries without assuming every currency has two decimal places."
tags: [php, money, payments]
---

Money should not enter a domain as a floating-point number. A binary float cannot represent
many decimal fractions exactly, and the resulting error tends to appear later in totals,
refunds, and reconciliation.

MoneyPHP represents an amount as an integer-like decimal string together with a currency.
The currency is part of the value because `1000` alone does not say whether the amount means
USD 10.00, JPY 1000, or BHD 1.000.

```php
use Money\Currency;
use Money\Money;

$price = new Money('1050', new Currency('USD'));
```

The amount uses the currency's minor unit. It should remain a string or a database integer
whose bounds have been checked; there is no need to pass through a float.

## Store amount and currency together

A queryable relational representation uses two columns:

```sql
amount_minor BIGINT NOT NULL,
currency_code CHAR(3) NOT NULL
```

The application must verify that MoneyPHP's amount string fits the database column before
casting it to a PHP integer. On a 64-bit PHP runtime, comparing decimal integer strings can
be done without requiring BCMath:

```php
<?php

declare(strict_types=1);

use Money\Money;
use OverflowException;

function amountForBigInt(Money $money): int
{
    $amount = $money->getAmount();
    $negative = str_starts_with($amount, '-');
    $digits = ltrim($amount, '-0');
    $digits = $digits === '' ? '0' : $digits;
    $limit = $negative ? ltrim((string) PHP_INT_MIN, '-') : (string) PHP_INT_MAX;

    if (strlen($digits) > strlen($limit)
        || (strlen($digits) === strlen($limit) && strcmp($digits, $limit) > 0)
    ) {
        throw new OverflowException('Money amount does not fit a PHP integer.');
    }

    return (int) $amount;
}
```

If the application needs values outside `BIGINT`, keep the amount as a decimal string and use
a suitable database numeric type. Silent narrowing is the failure to avoid.

## Format with the currency definition

Display is a separate boundary. Dividing by `100` assumes every currency has two fraction
digits. MoneyPHP's formatter uses currency metadata:

```php
use Money\Currencies\ISOCurrencies;
use Money\Formatter\DecimalMoneyFormatter;

$formatter = new DecimalMoneyFormatter(new ISOCurrencies());

echo $formatter->format(Money::USD(1050)); // 10.50
echo $formatter->format(Money::JPY(1050)); // 1050
```

`DecimalMoneyFormatter` produces a decimal amount. Locale-specific symbols and grouping are a
presentation choice and may require a different formatter.

## Parse once at the boundary

An API contract should prefer an explicit representation:

```json
{
    "amount": "1050",
    "currency": "USD"
}
```

If the input is a human decimal such as `"10.50"`, parse it with the expected currency and
locale before it reaches domain logic. Reject ambiguous values rather than guessing whether
a comma is a decimal or grouping separator.

Arithmetic should use Money operations and reject mixed currencies unless an explicit
exchange operation is part of the use case. Allocation and splitting also need an explicit
remainder rule so the minor units still add up to the original amount.

The same boundary applies in Go; see [Money in Go, done properly](/money-in-go-done-properly).
The language changes, but the durable rules do not: keep amount and currency together, avoid
floats, and make rounding and conversion visible.
