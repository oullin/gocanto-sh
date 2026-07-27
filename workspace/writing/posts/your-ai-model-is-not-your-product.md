---
title: Your AI model is not your product
date: 2025-11-04
updated: 2026-07-27
description: "A response to IBM's AI stack model, focused on the application, data, orchestration, and operational controls that determine whether a model becomes a dependable product."
tags: [ai, architecture, product]
---

This article began as a response to IBM Technology's
[overview of the AI stack](https://youtu.be/RRKwmeyIc24). The useful part of that model is
not the number of layers. It is the reminder that choosing a model leaves most product
decisions unresolved.

A model accepts input and produces output. A product has users, permissions, data contracts,
failure behaviour, support obligations, and a reason to exist when the model provider
changes.

## The surrounding system determines quality

Four boundaries matter more than a benchmark score on its own.

**Data.** What information may be retrieved, who is allowed to see it, how current it must
be, and how the system records where an answer came from. Retrieval that ignores tenancy or
document permissions is a data leak with a fluent interface.

**Orchestration.** How prompts, tools, retries, structured outputs, and model calls form one
operation. The application should own state and policy. The model may propose an action; it
should not decide whether it is authorized to perform it.

**Application.** The workflow in which the output becomes useful. A draft that a person can
review is a different product from an autonomous mutation. The interface should make
uncertainty, sources, approval, and recovery visible rather than hiding them behind a chat
box.

**Operations.** Latency budgets, cost limits, model-version changes, evaluations, incident
logs, and a fallback when a provider is slow or unavailable. A good demonstration under one
prompt is not evidence that the system will behave predictably across a release.

## Models should be replaceable

This does not mean every model is interchangeable. Capability, context limits, tool use,
price, and regional availability can materially affect the design.

It means the business contract should not be “whatever this model usually says.” Put typed
inputs and outputs around the call. Validate domain rules after parsing. Record the model and
prompt version. Keep provider-specific details at an adapter boundary where practical.

That makes a model upgrade a measured product change. The team can replay representative
cases, compare quality and cost, and roll back without rewriting the user workflow.

## Start from the consequence

The clearest design question is what happens after the model responds.

If the answer is displayed as a suggestion, provenance and a correction path may be enough.
If it changes a payment, sends a message, or alters production configuration, the system
needs identity, authorization, idempotency, an approval policy, and an audit record that do
not depend on the model's own judgment.

The model is important. It is simply not the whole product. The durable work is turning a
probabilistic capability into a bounded workflow that remains useful when an answer is wrong,
a dependency fails, or the model changes.
