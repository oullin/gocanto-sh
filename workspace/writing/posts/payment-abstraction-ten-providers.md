---
title: Ten gateways do not become one gateway
date: 2026-06-11
updated: 2026-07-22
description: "Adyen, Stripe, PayPal, WeChat, PayDollar and half a dozen more behind one checkout. The shared interface was the easy part; capabilities, error meaning, webhook order, and recovery were the work."
tags: [payments, architecture, integrations, contract-testing]
---

By the tenth gateway, our interface was a polite lie.

Adyen, Stripe, PayPal, WeChat, PayDollar, and several more behind one checkout at
BeMyGuest, serving e-commerce and marketplace flows across South East Asia. Every one of
them implemented the same four verbs. Authorise, capture, refund, query. On paper we had an
abstraction. In practice, the code that consumed it had learned which provider it was
talking to, and had opinions.

That is the actual failure mode of a payment abstraction. Not that it does not compile. That
it compiles while the business logic quietly grows provider-shaped branches, and nobody
notices until adding number eleven means touching checkout.

## The verbs were never the hard part

The differences that break a checkout do not live in the method names. They live in
capabilities, timing, what an error means, what order webhooks arrive in, and what recovery
looks like when the answer never comes.

So the interface gets designed from what checkout and the ledger need to ask, in our
vocabulary, not by averaging ten SDKs:

```go
type Gateway interface {
    Create(ctx context.Context, payment PaymentRequest) (PaymentAttempt, error)
    Capture(ctx context.Context, capture CaptureRequest) (PaymentAttempt, error)
    Refund(ctx context.Context, refund RefundRequest) (RefundAttempt, error)
    Query(ctx context.Context, reference Reference) (ProviderPayment, error)
}
```

Requests carry a stable operation ID, money as amount plus currency, customer context,
return URLs, and the narrow metadata the domain actually permits. Provider-specific fields
do not leak in as an untyped map, and this is the rule I would defend hardest.

**A generic `options` bag becomes an undocumented second API within a quarter.** Everything
awkward gets shoved into it, nothing is typed, nothing is tested, and eventually a key that
only Adyen reads is being set by code that thinks it is talking to PayPal. When a provider
genuinely needs extra information, it becomes a declared capability or a typed configuration
for that method. Both of those you can search for. A map key you cannot.

## Capabilities are data, not documentation

Providers support different combinations of things, and the list is longer than anyone
expects: authorise-then-capture versus immediate sale, partial capture, partial refund,
synchronous confirmation versus redirect versus asynchronous webhook, saved instruments,
recurring mandates, supported currencies and countries, amount limits, provider-side
idempotency, and whether you can query by your own merchant reference.

If that lives in a wiki, checkout will find out the hard way. So it lives in the type:

```ts
type GatewayCapabilities = {
    flow: "direct" | "redirect" | "asynchronous";
    separateCapture: boolean;
    partialCapture: boolean;
    partialRefund: boolean;
    queryByMerchantReference: boolean;
};
```

Exposed to routing and validation before checkout starts, not consulted at capture time.
Discovering that the selected provider cannot do a partial capture at the moment you attempt
one leaves you holding an authorised payment, a customer, and no good options. With
capabilities as data, the domain either picks a provider that can do the job or tells the
customer the truth up front.

`queryByMerchantReference` deserves its own mention, because it is the capability that
determines whether you can recover from an ambiguous outcome. Providers that do not offer it
turn every timeout into a manual investigation.

## Normalise errors without erasing the evidence

Provider SDK errors are simultaneously too detailed for checkout and too vague for
operations. Both audiences are badly served by passing them through.

The taxonomy that survived ten integrations:

| Normalised error | Means | Retry |
| --- | --- | --- |
| `declined` | A completed business decision | Never automatically |
| `invalid-request` | Our integration or input defect | No, fix it |
| `authentication-failed` | Configuration incident | No, page someone |
| `rate-limited` | Provider is throttling us | Yes, on their budget |
| `temporarily-unavailable` | Transient | Yes, may be safe |
| `unknown-outcome` | We do not know what happened | **Reconcile first** |

The attempt record keeps the redacted provider code, request ID, HTTP status, and raw
category underneath. Support needs the evidence; the workflow needs stable behaviour; those
are different requirements and collapsing them loses one of them.

Retry policy belongs to the normalised error combined with the operation type, not to the
error alone. Retrying a query is free. Retrying a capture that returned an ambiguous response
is how you charge someone twice.

## Events become state transitions, not a switch statement

Every provider signs and names its webhooks differently, and this is where provider logic
loves to leak back in.

The adapter verifies the exact raw request body, checks freshness, deduplicates the provider
event, and translates it into a domain event. The shared handler then applies the payment
state machine. If that handler contains `if provider == ...`, the abstraction has already
failed and the only question is how far the rot has spread.

Store both identities: the provider event ID for transport deduplication, and the domain
transition ID for the resulting effect. Out-of-order and repeated events stay visible in the
audit trail even when they change nothing, which matters at 3am when someone asks why a
payment moved backwards. It did not. A stale `authorised` arrived after `captured` and was
recorded and ignored, and you can show them that.

## The contract suite is the abstraction

The interface is a claim. The shared test suite is what makes it true.

Every adapter runs the same behavioural suite against fixtures or a sandbox: that the
idempotency key is forwarded in the form the provider requires, that money uses the
provider's minor-unit rules, that known responses map to the correct domain states, that
error codes map to the retry taxonomy, that signatures reject changed bodies and stale
timestamps, that duplicate webhooks do not repeat state or ledger effects, and that an
ambiguous create or capture can be queried and reconciled.

Provider-specific tests still cover authentication and payload detail. But it is the shared
suite that proves adding provider eleven has not weakened a guarantee checkout depends on,
and that is the only claim anyone actually cares about.

Keep the captured fixtures redacted and versioned. When a provider changes a response shape,
the diff is reviewable and last year's incident is this year's regression test.

## Route with evidence, and never fail over an unknown

Once providers share a reliable boundary, routing can start considering availability, cost,
currency, country, capability, and recent success rate. It still has to be deterministic and
explainable: record why a provider was chosen and which fallback rule fired, or you will be
reverse-engineering it during an outage.

One hard rule. **Never fail over an ambiguous mutation to a second provider until the first
outcome is resolved.** "Try another gateway" is a reasonable-sounding sentence that charges
the customer twice.

Dashboards compare authorisation success, latency, error taxonomy, webhook lag, and
reconciliation differences per provider. Aggregate uptime hides the integration that is
quietly declining one market, which is the outage that costs the most and pages the least.

## The goal was never identical providers

It was stable business logic with the differences made explicit at the boundary.

Checkout speaks one payment language. Adapters preserve provider evidence. The contract suite
enforces the same correctness rules for everyone. Adding the eleventh gateway is still
integration work, and it no longer means rewriting the product around another SDK.

<!-- NEED: one concrete war story to open or close with. The strongest version of this post
has a named incident: the provider whose webhook ordering broke an assumption, or the
capability we discovered at the wrong moment. Anything real and shareable would replace the
generalised framing. -->

The lie in that original interface was not the four verbs. It was believing the verbs were
the contract.

---

_The correctness rules referenced here are in [signed webhooks](/signed-webhooks) and
[designing idempotent payment flows](/idempotent-payment-flows). I run
[Oullin](https://oullin.io), where payment architecture is one of the things people bring us.
Find me on [X (@gocanto)](https://x.com/gocanto)._
