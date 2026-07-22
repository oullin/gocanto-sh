---
title: Designing a payment abstraction that survives ten-plus providers
date: 2026-07-22
updated: 2026-07-22
description: "How to keep checkout and ledger logic stable across ten-plus payment providers using capability-aware contracts, typed errors, idempotency, webhook normalization, and contract tests."
tags: [payments, architecture, integrations, contract-testing]
---

Ten payment providers do not become one provider because they implement the same interface.

Across gateway integrations I have worked with—cards, wallets, regional methods, redirects, and
server-to-server flows—the common verbs are easy: authorize, capture, refund, query. The differences
that break checkout live in capabilities, timing, error meaning, webhook order, and recovery.

A durable abstraction keeps the business workflow stable without pretending those differences do
not exist.

## Start from the domain operation

Do not design the interface by averaging provider SDKs. Define what checkout and the ledger need to
ask in your own vocabulary.

```go
type Gateway interface {
    Create(ctx context.Context, payment PaymentRequest) (PaymentAttempt, error)
    Capture(ctx context.Context, capture CaptureRequest) (PaymentAttempt, error)
    Refund(ctx context.Context, refund RefundRequest) (RefundAttempt, error)
    Query(ctx context.Context, reference Reference) (ProviderPayment, error)
}
```

Requests carry stable operation IDs, money as amount plus currency, customer context, return URLs,
and the narrow metadata the domain permits. Provider-specific fields do not leak into the shared
request as an untyped map.

When a provider requires extra information, model it as a declared capability or a typed method
configuration. A generic `options` bag eventually becomes an undocumented second API.

## Make capabilities visible

Providers support different combinations:

- authorize then capture versus immediate sale;
- partial capture or partial refund;
- synchronous confirmation versus redirect or asynchronous webhook;
- saved instruments and recurring mandates;
- currencies, countries, and amount limits;
- provider idempotency and query-by-merchant-reference.

Expose those capabilities to routing and validation before checkout starts. If partial capture is a
business requirement, discovering at capture time that the selected provider cannot do it is too
late.

```ts
type GatewayCapabilities = {
    flow: "direct" | "redirect" | "asynchronous";
    separateCapture: boolean;
    partialCapture: boolean;
    partialRefund: boolean;
    queryByMerchantReference: boolean;
};
```

The domain can select a compatible provider or present an accurate limitation. It does not branch on
provider names.

## Normalize errors without erasing evidence

Provider SDK errors are usually too detailed for checkout and too vague for operations.

Translate them into a typed taxonomy:

- `declined`: a completed business decision; do not retry automatically;
- `invalid-request`: integration or input defect;
- `authentication-failed`: configuration incident;
- `rate-limited`: retry according to the provider budget;
- `temporarily-unavailable`: retry may be safe;
- `unknown-outcome`: reconcile before another mutation.

Retain the redacted provider code, request ID, HTTP status, and raw category in the attempt record.
Support needs the evidence, while the workflow needs stable behaviour.

Retry policy belongs to the normalized error and operation type. Retrying a query is not the same as
retrying a capture with an ambiguous response.

## Normalize events into state transitions

Every provider signs and names webhooks differently. The adapter verifies the exact raw request,
checks freshness, deduplicates the provider event, and translates it into a domain event.

The shared handler then applies the payment state machine. It should not contain ten branches such as
`if provider == ...`.

Store both identities: provider event ID for transport deduplication and domain transition ID for
the resulting effect. Out-of-order or repeated events remain visible in the audit trail even when
they do not change state.

## Test the contract, not only the adapter methods

Each adapter runs the same behavioral suite against provider fixtures or a sandbox:

- the idempotency key is forwarded in the required form;
- money uses the provider’s expected minor-unit rules;
- known responses map to the correct domain states;
- error codes map to the retry taxonomy;
- signatures reject changed bodies and stale timestamps;
- duplicate webhooks do not repeat state or ledger effects;
- ambiguous create/capture outcomes can be queried and reconciled.

Provider-specific tests cover authentication and payload details. The shared contract suite proves
that adding a provider does not weaken checkout guarantees.

Keep captured fixtures redacted and versioned. When a provider changes a response shape, the diff is
reviewable and the old incident becomes a regression test.

## Route with evidence

Once providers share a reliable boundary, routing can consider availability, cost, currency,
country, capability, and recent success rate. Routing must still be deterministic and explainable.

Record why a provider was selected and which fallback rule ran. Never fail over an ambiguous
mutation to a second provider until the first outcome is resolved; “try another gateway” can charge
the customer twice.

Operational dashboards should compare authorization success, latency, error taxonomy, webhook lag,
and reconciliation differences by provider. Aggregate uptime alone hides the integration that is
quietly declining one market.

## A good abstraction exposes the differences that matter

The goal is not identical providers. It is stable business logic with explicit capability and
failure differences at the boundary.

Checkout speaks one payment language. Adapters preserve provider evidence. Contracts enforce the
same correctness rules. Adding provider eleven is still integration work, but it no longer requires
rewriting the product around another SDK.
