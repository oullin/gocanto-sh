---
title: Building auditable AI agents for regulated systems
date: 2026-07-22
updated: 2026-07-22
description: "A production architecture for regulated AI agents: typed tools, least privilege, human approval, structured output, signed event logs, replay, and fail-closed delivery gates."
tags: [ai-agents, audit, mcp, regulated-systems]
expertise: https://gocanto.sh/expertise/regulated-ai-systems
expertiseLabel: auditable AI systems
---

An AI agent should not be trusted because its last answer looked sensible.

In a regulated system, useful automation must leave evidence. An operator needs to know which input
the agent received, which tools it was allowed to call, what each tool returned, where a human
approved the work, and which validators accepted the final artifact.

That changes the architecture. The model becomes one fallible component inside a controlled
workflow, not the workflow itself.

This is the control model I am applying while building an agent platform for fixed-scope delivery
in regulated environments. Runs must be replayable, consequential steps must be auditable, and
validation must fail closed before an artifact can leave the workflow.

## Put deterministic software around the model

The application owns identity, permissions, state, retries, and policy. The model proposes actions
inside that boundary.

Every tool has a typed input and output contract. A tool call is rejected before execution if its
arguments fail schema validation. The tool implementation authenticates as the current actor and
does not inherit a general-purpose service credential from the agent runtime.

```ts
type Tool<I, O> = {
    name: string;
    input: Schema<I>;
    output: Schema<O>;
    execute(ctx: ActorContext, input: I): Promise<O>;
};
```

The registry exposed to a run is assembled from policy. A read-only analysis agent does not even see
the mutation tools. Hiding a tool in the prompt is not access control.

Structured output receives the same treatment. Parse into a schema, reject unknown fields where
appropriate, and validate business invariants after syntax. Valid JSON can still request an invalid
currency, cross a tenant boundary, or reference a record the actor cannot access.

## Separate proposal from consequence

Consequential actions need an approval boundary the model cannot talk around.

The agent can prepare a payment-integration patch, migration plan, or customer communication. A
human reviews the exact artifact and the evidence that produced it. Approval creates a new signed
event. Only then does a deterministic executor perform the mutation.

This is stronger than asking the model, “Are you sure?” The approver sees a stable diff, not a fresh
generation that can change between review and execution.

Approval policies can be risk-based:

- automatic for read-only retrieval and formatting;
- peer review for code or configuration changes;
- named owner approval for production or financial mutations;
- two-person control for especially sensitive operations.

The orchestration layer enforces the policy; prompts only explain it.

## Record an event chain, not a chat transcript

A transcript is useful context, but it is not a complete audit record. Store normalized events for
the actions that matter:

```json
{
  "run_id": "run_01...",
  "sequence": 17,
  "type": "tool.completed",
  "tool": "repository.apply_patch",
  "input_digest": "sha256:...",
  "output_digest": "sha256:...",
  "actor": "gus@example",
  "previous_digest": "sha256:...",
  "signature": "..."
}
```

Hash large or sensitive payloads and keep the protected content in the correct data store. The event
chain proves ordering and detects alteration without copying secrets into a convenient log.

Record model and prompt-template versions, tool-registry version, knowledge sources, validation
results, token usage, and timing. Redact credentials before persistence. “Log everything” is not a
safe retention policy.

## Replay without repeating side effects

Reproducibility does not mean the model will emit the same tokens. It means the system can rebuild
the run context, inspect every decision boundary, and re-run safe stages against recorded inputs.

Tool results can be replayed as fixtures for regression tests. Mutation tools return stable operation
IDs and enforce idempotency, so an orchestrator retry cannot repeat the external effect. A replay
mode should refuse live mutations by default.

This makes incidents testable. If a validator allowed a broken artifact, add the failing run to the
suite and prove the revised gate rejects it.

## Fail closed at delivery boundaries

Model output is unfinished until ordinary engineering gates pass.

For code, that means format, lint, typecheck, tests, dependency policy, and a scoped diff review. For
documents or decisions, it can mean schema validation, source coverage, policy checks, and explicit
approval. A failed gate stops delivery; the agent cannot summarize the failure as “mostly done.”

Provider fallback follows the same rule. Switching from one model to another may restore
availability, but it does not weaken schemas, tools, approvals, or validators. Providers are an
implementation detail behind the run contract.

## Observability should answer operational questions

Track more than model latency:

- run completion and abandonment by workflow;
- tool failure and retry rate;
- approval wait time and rejection reasons;
- validation failures by gate and artifact type;
- cost and token usage by successful outcome;
- replay rate and repeated incident signatures.

The important metric is not “messages sent.” It is how reliably the system produces accepted work
without unsafe intervention.

## The model can be nondeterministic; the system cannot be vague

Auditable agent architecture does not eliminate model risk. It makes that risk bounded and visible.

Typed tools limit what can happen. Approval separates suggestion from consequence. Signed events
preserve evidence. Replay and validation turn failures into regression tests. Those are the controls
that let useful AI operate in environments where “the model decided” is not an acceptable incident
report.
