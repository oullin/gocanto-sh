import type { AuthorityPagesFixture } from "#store/types";

export const authorityPages = {
    version: "1.0.0",
    data: [
        {
            kind: "resume",
            path: "/resume",
            title: "Gustavo Ocanto Resume — Software Architect for Regulated Systems",
            description:
                "Public resume for Gustavo Ocanto, a Singapore-based software architect and principal engineer with 20+ years across banking, payments, e-commerce, and production AI.",
            eyebrow: "Public resume · Singapore",
            heading: "Software architect for regulated systems",
            lead: "Hands-on principal engineer and engineering leader with 20+ years building systems where failure costs money or trust: payment platforms, banking cores, event pipelines, e-commerce, and auditable AI workflows.",
            updated_at: "2026-07-22",
            proof: [
                "20+ years shipping production software",
                "Go, TypeScript, Java, PHP, Vue, Kafka, PostgreSQL",
                "Banking, fintech, payments, e-commerce, and regulated AI",
                "Singapore citizen · English and Spanish",
            ],
            sections: [],
            related_writing: [
                {
                    label: "How to modernise an AS/400 banking core without replacing it",
                    url: "https://writing.gocanto.sh/modernise-as400-banking-core",
                },
                {
                    label: "Building auditable AI agents for regulated systems",
                    url: "https://writing.gocanto.sh/auditable-ai-agents-regulated-systems",
                },
            ],
        },
        {
            kind: "expertise",
            path: "/expertise/regulated-ai-systems",
            title: "AI Agents for Regulated Systems | Gustavo Ocanto",
            description:
                "Production AI architecture for regulated environments: typed tools, human approval, fail-closed validation, reproducible runs, and signed audit trails.",
            eyebrow: "Expertise · Production AI",
            heading: "AI agents that can survive an audit",
            lead: "Agentic systems become useful when their work is bounded, observable, reproducible, and reviewable. I build the orchestration and delivery controls that turn model output into dependable production software.",
            updated_at: "2026-07-22",
            proof: [
                "Typed tool registries and provider abstraction",
                "Human-in-the-loop approval at consequential boundaries",
                "Signed event chains and replayable JSONL audit logs",
                "Validators that fail closed before delivery",
            ],
            sections: [
                {
                    heading: "Architecture before prompts",
                    body: "The system owns identity, permissions, state, schemas, retries, and auditability. Models operate inside those contracts rather than inventing the workflow at runtime.",
                    bullets: [
                        "Explicit tool schemas and least-privilege access",
                        "Structured output validated at every boundary",
                        "Provider-independent orchestration and fallback",
                    ],
                },
                {
                    heading: "Evidence with every run",
                    body: "A production run should be explainable after the fact. Inputs, tool calls, approvals, outputs, and validation results travel together as one reviewable record.",
                    bullets: [
                        "Append-only execution records",
                        "Deterministic templates and artifact manifests",
                        "Replay tooling for incidents and regression tests",
                    ],
                },
            ],
            related_writing: [
                {
                    label: "Building auditable AI agents for regulated systems",
                    url: "https://writing.gocanto.sh/auditable-ai-agents-regulated-systems",
                },
                {
                    label: "Merging is not shipping",
                    url: "https://writing.gocanto.sh/merging-is-not-shipping",
                },
                {
                    label: "Shipping Herdr plugins people can actually use",
                    url: "https://writing.gocanto.sh/shipping-herdr-plugins",
                },
            ],
        },
        {
            kind: "expertise",
            path: "/expertise/banking-core-modernisation",
            title: "AS/400 & Core Banking Modernisation | Gustavo Ocanto",
            description:
                "Modernise AS/400, VCOS, and legacy banking cores with Go integration layers, resilient event pipelines, observability, and low-risk cutovers.",
            eyebrow: "Expertise · Core banking",
            heading: "Modernise the surface without gambling the core",
            lead: "Legacy banking systems often contain decades of correct domain behaviour. I modernise around that value: stable contracts, resilient ingress, event-driven integration, and gradual cutovers instead of a risky rewrite.",
            updated_at: "2026-07-22",
            proof: [
                "Go reverse proxy fronting a VCOS and AS/400 core",
                "HTTP, Kafka, Redis Streams, and RabbitMQ ingress",
                "ATM, account, and cross-border payment pipelines",
                "Zero-downtime releases with rollback discipline",
            ],
            sections: [
                {
                    heading: "A controlled modern boundary",
                    body: "The integration layer owns authentication, rate limits, caching, circuit breakers, audit records, and a stable API while the system of record remains unchanged.",
                    bullets: [
                        "Typed contracts around legacy protocols",
                        "Graceful degradation and bounded retries",
                        "Observable calls with correlation and audit IDs",
                    ],
                },
                {
                    heading: "Migration as an operating process",
                    body: "Strangler migrations work when old and new paths can coexist, reconcile, and roll back. The release plan is part of the architecture, not a handoff after development.",
                    bullets: [
                        "Shadow reads and output comparison",
                        "Replayable events and reconciliation reports",
                        "Phased traffic movement with explicit rollback triggers",
                    ],
                },
            ],
            related_writing: [
                {
                    label: "How to modernise an AS/400 banking core without replacing it",
                    url: "https://writing.gocanto.sh/modernise-as400-banking-core",
                },
                {
                    label: "Kafka and Go for payment pipelines",
                    url: "https://writing.gocanto.sh/kafka-go-payment-pipelines",
                },
            ],
        },
        {
            kind: "expertise",
            path: "/expertise/payment-systems",
            title: "Payment Systems Architecture | Gustavo Ocanto",
            description:
                "Payment architecture built for retries, reconciliation, and provider failure: wallets, gateway abstraction, idempotency, signed webhooks, and auditable ledgers.",
            eyebrow: "Expertise · Payments",
            heading: "Payment systems designed for the second attempt",
            lead: "The happy path is the easy part. Reliable payments require explicit identities, idempotent mutations, durable state transitions, reconciliation, and recovery when a provider or network fails halfway through.",
            updated_at: "2026-07-22",
            proof: [
                "Multi-currency wallets and ledger reconciliation",
                "Ten-plus gateway integrations across regional markets",
                "Idempotent orchestration and signed webhooks",
                "Retries, circuit breakers, and provider-neutral contracts",
            ],
            sections: [
                {
                    heading: "Correctness across retries",
                    body: "Every mutating operation gets a stable idempotency identity. State transitions are explicit, webhook authenticity and freshness are verified, and duplicate delivery is expected rather than treated as an edge case.",
                    bullets: [
                        "Idempotency keys scoped to logical operations",
                        "Signed webhooks with timestamp windows",
                        "Immutable transaction and reconciliation records",
                    ],
                },
                {
                    heading: "Providers behind one domain contract",
                    body: "A gateway adapter translates provider quirks without leaking them into checkout or ledger logic. Capability differences stay visible, but business workflows keep one vocabulary.",
                    bullets: [
                        "Typed provider errors and retry classification",
                        "Contract tests against provider fixtures",
                        "Failover and manual recovery runbooks",
                    ],
                },
            ],
            related_writing: [
                {
                    label: "Designing idempotent payment flows",
                    url: "https://writing.gocanto.sh/idempotent-payment-flows",
                },
                {
                    label: "How to cut API latency from two seconds to 100 milliseconds",
                    url: "https://writing.gocanto.sh/cut-api-latency-two-seconds-to-100ms",
                },
                {
                    label: "Signed webhooks done right",
                    url: "https://writing.gocanto.sh/signed-webhooks",
                },
                {
                    label: "Designing a payment abstraction that survives ten-plus providers",
                    url: "https://writing.gocanto.sh/payment-abstraction-ten-providers",
                },
            ],
        },
    ],
} as const satisfies AuthorityPagesFixture;
