---
title: When a real-time feature store is the wrong fix for fraud
date: 2025-10-09
updated: 2026-07-27
description: "A decision framework for separating freshness problems from training-serving skew before adding a real-time feature store to a fraud system."
tags: [fraud, machine-learning, architecture]
---

A real-time feature store can make recent values available to a fraud model with consistent
lookup semantics. It cannot correct a feature whose definition differs between training and
serving, repair labels that leaked future information, or prove that fresher data improves a
decision.

Those problems are often grouped under “we need online features,” which makes an
infrastructure purchase look like a modelling fix.

## Name the failure first

Before changing the serving architecture, separate three questions.

**Are the values defined consistently?** If training computes “failed payments in the last
hour” one way and production computes it another, the problem is semantic skew. Put the
transformation in shared, versioned code and test the same examples on both paths.

**Could the training row have existed at decision time?** Historical joins must be
point-in-time correct. A chargeback recorded next week cannot be allowed into a feature used
to simulate today's authorization decision.

**Does freshness change the outcome?** A value updated every second costs more to build and
operate than one updated hourly. That cost is justified only if the fresher value improves a
business measure such as fraud loss, false positives, review volume, or decision latency.

A feature store may help with the first two by centralizing definitions and time-aware
retrieval. It does not make either property automatic.

## Start with the decision path

A minimal online path can be enough:

```text
request
  -> fetch a small versioned feature set
  -> evaluate model and policy rules
  -> record feature versions and decision
  -> return within the latency budget
```

The record matters. Without the feature values or immutable references used for a decision,
the team cannot reproduce a false positive, compare a replacement model, or explain why a
transaction was blocked.

Freshness also needs an explicit fallback. If the online store is unavailable, does the
system use a bounded-stale value, fall back to rules, send the transaction to review, or fail
closed? “The feature service is highly available” is not a decision for the failure case.

## Evidence before platform

I would require the following before introducing a broad real-time feature platform:

1. A named set of features whose current update interval causes measurable loss.
2. Shared transformation code or equivalence tests between offline and online computation.
3. Point-in-time training data for those features.
4. A latency and availability budget for the decision path.
5. Shadow results showing that fresher values improve the chosen business metric.
6. An owner for backfills, late events, monitoring, and incident response.

If only two features need recent velocity counts, a transactional counter store and a small
read interface may be the better first system. If dozens of teams need governed feature
definitions, historical retrieval, and low-latency serving, a feature store has a stronger
case.

The aim is not to avoid feature stores. It is to keep “real time” from becoming a substitute
for identifying which inconsistency or delay is actually harming the fraud decision.
