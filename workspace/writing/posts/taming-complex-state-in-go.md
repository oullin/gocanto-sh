---
title: Taming complex state in Go
date: 2026-03-13
updated: 2026-07-27
description: "A practical look at explicit workflow definitions, state-machine and multi-place markings, transition guards, events, and audit trails in Go."
tags: [go, workflows, state-machines]
---

A `status` column works until a domain needs parallel approvals, guarded transitions, or an
audit of how an object reached its current state. At that point the problem is not storing a
string. It is defining which transitions are legal and keeping side effects at known
boundaries.

`oullin/workflow` was extracted from work on domain objects with branching lifecycles. The
library provides two related models: a conventional state machine, where a subject occupies
one place, and a Petri-net-style workflow, where it can occupy more than one place.

Source and current API documentation live in
[`oullin/workflow`](https://github.com/oullin/workflow).

## Choose the marking model first

A single-state workflow fits a linear lifecycle such as:

```text
draft -> pending -> active -> suspended
```

A multi-place marking fits a process where legal review and finance approval can both be
active and both must complete before publication. Flattening that into one status usually
creates compound names or state flags whose valid combinations are not defined anywhere.

The definition builder makes places and transitions explicit:

```go
definition, err := workflow.NewDefinitionBuilder().
    AddPlace("draft").
    AddPlace("payment_pending").
    AddPlace("active").
    SetInitialPlaces("draft").
    AddTransition("collect_payment", []string{"draft"}, []string{"payment_pending"}).
    AddTransition("activate", []string{"payment_pending"}, []string{"active"}).
    Build()
if err != nil {
    return err
}
```

The important result is not the fluent syntax. It is that the topology can be validated and
reviewed independently from the service method that happens to invoke a transition.

## Keep state storage outside the engine

The marking store connects the workflow to a domain object through explicit getters and
setters rather than requiring the domain type to embed a framework base type:

```go
markingStore := &store.SingleState[*Subscription]{
    Getter: func(subscription *Subscription) string {
        return subscription.State
    },
    Setter: func(subscription *Subscription, state string) {
        subscription.State = state
    },
}
```

That boundary also makes persistence a deliberate application concern. Updating an in-memory
marking and committing a database transaction are not automatically the same operation.
Callers still need a transaction strategy and idempotent side effects.

## Guards and events have different jobs

A guard answers whether a transition may occur. Authorization, required fields, and business
preconditions belong there when they can be evaluated without performing the transition's
consequence.

Events expose the transition lifecycle to application code. They can support audit records,
notifications, or follow-up work, but handlers need the same care as any event system:
ordering must be understood, failures need a policy, and a retried handler must not duplicate
an external effect.

An audit trail is useful because it records transitions consistently. It does not replace the
application's actor identity or persistence boundary; those values have to be supplied
correctly.

## Diagrams are generated output

The library can emit Graphviz DOT from a definition. That is useful in design reviews because
the diagram comes from the same topology the engine executes.

```go
dumper := &workflow.GraphvizDumper{}
dot := dumper.Dump(definition)
```

The generated graph is evidence. A decorative “workflow” cover image is not, so the old
article artwork was deliberately not carried into this archive.

Reach for this kind of engine when legal transitions and branching state are part of the
domain. A small enum and a switch remain easier to operate when the lifecycle is genuinely
small.
