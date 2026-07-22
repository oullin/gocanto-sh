---
title: Agents that can survive an audit
date: 2026-07-10
updated: 2026-07-22
description: "I sell fixed-scope, fixed-price software built by agents. That only works if I can prove what they did: typed tools, approval boundaries, signed event chains, replay, and validators that fail closed."
tags: [ai-agents, audit, mcp, regulated-systems]
---

I sell fixed-scope, fixed-price engineering work delivered by agents. That business only
exists because I can prove what the agents did.

Not describe it. Prove it: which input the run received, which tools it was permitted to
call, what each tool returned, where a human approved the work, which validators accepted the
artifact, and which model version produced it. If I cannot answer those, I am selling
somebody's judgement dressed as a deliverable, and in a regulated environment that is not a
product, it is a liability with an invoice attached.

The platform is `oag`, an agent runtime in Go that backs three offerings: payment
integrations, event pipelines, and AS/400 modernisation pilots. The architecture below is
what fixed price forces you into, and it turns out to be the same architecture a bank would
ask for.

**An agent should not be trusted because its last answer looked sensible.**

## The deterministic software owns everything that matters

The model proposes. The application owns identity, permissions, state, retries, and policy.
Get that backwards and every control you add afterwards is a suggestion in a prompt.

Every tool has a typed input and output contract, and a call is rejected before execution if
its arguments fail schema validation:

```ts
type Tool<I, O> = {
    name: string;
    input: Schema<I>;
    output: Schema<O>;
    execute(ctx: ActorContext, input: I): Promise<O>;
};
```

Two things about that signature. The tool authenticates as the current actor, not as a
general-purpose service credential borrowed from the runtime, so an agent cannot reach past
what the human on whose behalf it runs could reach. And the registry exposed to a run is
assembled from policy: a read-only analysis run does not merely decline the mutation tools,
it never sees them.

Hiding a tool in the prompt is not access control. It is a request.

Structured output gets identical treatment. Parse into a schema, reject unknown fields where
it matters, then validate business invariants after syntax, because valid JSON will happily
request an invalid currency, cross a tenant boundary, or reference a record the actor cannot
access. Syntax being correct tells you nothing about whether the content is allowed.

## Proposal and consequence are separate events

Consequential actions need an approval boundary the model cannot talk its way around.

The agent prepares the artifact: a payment integration patch, a migration plan, a customer
communication. A human reviews that exact artifact along with the evidence that produced it.
Approval writes a new signed event. Only then does a deterministic executor perform the
mutation.

This is categorically stronger than asking the model whether it is sure. The approver sees a
stable diff, not a fresh generation that can differ between the moment of review and the
moment of execution. Same words, entirely different guarantee.

Policy scales with risk rather than with enthusiasm:

| Action | Gate |
| --- | --- |
| Read-only retrieval and formatting | Automatic |
| Code or configuration changes | Peer review |
| Production or financial mutations | Named owner approval |
| Especially sensitive operations | Two-person control |

The orchestration layer enforces that table. Prompts only explain it, and prompts are advice.

## An event chain, not a chat transcript

A transcript is useful context and a poor audit record. It is long, unstructured, and mixes
reasoning with fact. What gets stored instead is a normalised event per action that matters:

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

Signed JSONL, each entry carrying the previous digest, so ordering is provable and alteration
is detectable. Large or sensitive payloads are hashed and the protected content stays in the
store that is supposed to hold it. The chain proves what happened without copying secrets
into a convenient log, which is the trap every "just log everything" approach walks into
about six weeks in.

Recorded alongside: model and prompt-template versions, tool-registry version, knowledge
sources, validation results, token usage, timing. Credentials redacted before persistence.
"Log everything" is not a retention policy, it is a future incident.

## Replay without repeating the side effects

Reproducibility does not mean the model emits identical tokens. It means the system can
rebuild the run context, inspect every decision boundary, and re-run the safe stages against
recorded inputs.

Tool results replay as fixtures for regression tests. Mutation tools return stable operation
IDs and enforce idempotency, so an orchestrator retry cannot repeat an external effect, which
is the same discipline as
[designing idempotent payment flows](/idempotent-payment-flows) and for the same reason.
Replay mode refuses live mutations by default.

The payoff is that incidents become testable. When a validator lets a broken artifact
through, the failing run joins the suite and the revised gate has to reject it. The class of
failure closes rather than recurring with a different filename.

## Fail closed, or you do not have a gate

Model output is unfinished until ordinary engineering gates pass. Format, lint, typecheck,
tests, dependency policy, scoped diff review. For documents and decisions: schema validation,
source coverage, policy checks, explicit approval.

A failed gate stops delivery. The agent does not get to summarise the failure as mostly done,
and the human does not get a green checkmark with a footnote.

This site is a small example of the same idea. Its build asserts that the deployed HTML has
exactly one canonical link and that my private contact details never reach a public page, and
[it fails the build rather than warning](/deleting-a-feature-is-a-graph-problem). A validator
that logs is decoration. A validator that stops the pipeline is a control.

Provider fallback follows the identical rule. `oag` runs Claude as primary and GPT-4 as
fallback behind a provider abstraction, so a model swap does not require product changes. It
also does not get to weaken schemas, tools, approvals, or validators. Providers are an
implementation detail behind the run contract, and if switching one changes what the system
is allowed to do, the contract was never real.

## What is worth watching

Model latency is the least interesting number available. The dashboard that predicts trouble
tracks run completion and abandonment by workflow, tool failure and retry rate, approval wait
time and rejection reasons, validation failures by gate and artifact type, cost and token
usage per accepted outcome, and repeated incident signatures across replays.

Cost per *accepted* outcome is the one that changes decisions. Tokens spent are trivially
measurable and tell you nothing; tokens spent per deliverable that passed every gate tells you
whether the workflow works.

## The model can be nondeterministic. The system cannot be vague

None of this eliminates model risk, and anyone claiming otherwise is selling something. It
makes the risk bounded and visible, which is the achievable goal.

Typed tools limit what can happen at all. Approval separates suggestion from consequence.
Signed events preserve the evidence. Replay and validation convert failures into regression
tests. Those four controls are the difference between useful automation and an expensive way
to generate plausible text.

They are also what makes fixed-price agent work possible. I can quote a scope because I can
prove the boundary, and the client can accept it because the evidence is inspectable rather
than promised. In environments where "the model decided" is not an acceptable line in an
incident report, that proof is the product.

---

_`oag` is the platform behind the fixed-scope engineering work at
[Oullin](https://oullin.io), where regulated AI architecture is one of the three things we
do. The discipline it borrows from is in [signed webhooks](/signed-webhooks) and
[designing idempotent payment flows](/idempotent-payment-flows). Find me on
[X (@gocanto)](https://x.com/gocanto)._
