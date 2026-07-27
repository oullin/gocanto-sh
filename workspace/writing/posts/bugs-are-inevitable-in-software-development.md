---
title: Bugs are inevitable in software development
date: 2023-06-21
updated: 2026-07-27
description: "Why useful software still carries defects, and how severity, affected users, security, and regulatory risk should shape the order in which teams fix them."
tags: [quality, delivery, leadership]
---

Software can be useful without being free of defects. That is not an excuse for careless
work. It is a consequence of changing requirements, large state spaces, third-party
dependencies, and limited time.

The reliable way to reduce defects is to reduce the amount of software: support fewer
behaviours, keep the design small, and spend longer refining it. Commercial products rarely
get that freedom. They have customers asking for more, integrations that change underneath
them, and deadlines that force choices.

The practical question is therefore not whether a backlog contains bugs. It is whether the
team understands their consequences and is fixing them in a defensible order.

## Triage by consequence

A useful ordering starts with risk:

1. Security, privacy, financial, and regulatory failures.
2. Data loss or corruption.
3. Outages and failures in a customer's main workflow.
4. Defects affecting many users or a contractual service level.
5. Localized problems with a safe workaround.
6. Cosmetic issues that do not block the task.

These categories are not permanent. A visual defect on a payment confirmation may be
cosmetic; the same defect on the amount or currency may lead a customer to approve the wrong
transaction. Context determines severity.

Frequency matters too, but it should not erase impact. A rare bug that can duplicate a
charge deserves more attention than a common alignment problem. Conversely, a small defect
that interrupts every user's daily work may deserve an immediate fix because its aggregate
cost is high.

## A backlog is a decision record

Leaving a defect open should be an explicit choice with an owner, evidence, and a review
point. “Not now” is reasonable when the workaround is safe and the cost of changing the
system is greater than the harm. “Nobody looked closely” is not prioritisation.

The same applies to a fix. A hurried patch can introduce a larger failure than the one it
removes. Good triage includes the blast radius of the change, the confidence of the test
coverage, and the cost of deploying or rolling it back.

Bug counts alone say little about product quality. A team with a long, well-triaged backlog
may be in better control than one that closes issues quickly without measuring recurrence or
customer impact.

The aim is not to become comfortable with defects. It is to spend engineering attention
where it protects users and the product most.

This article first appeared as a
[LinkedIn post](https://www.linkedin.com/pulse/bugs-inevitable-software-development-gustavo-ocanto).
