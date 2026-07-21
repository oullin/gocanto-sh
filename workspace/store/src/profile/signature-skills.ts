import type { ProfileSkillRecord } from "#store/types";

export const signatureSkills = [
    {
        uuid: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        percentage: 92,
        item: "Leadership",
        description:
            "Engineering leadership across banking, fintech and SaaS: squads, SLOs, hiring bar, on-call, growth plans. Hands-on enough to land technical decisions, structured enough to scale teams.",
        signature: true,
        long_description:
            "I lead engineering teams the way I write services: with clear contracts, predictable cadence, and observability built in. Scaled groups from 10 to 20+ at Aspire and ran a 12-person APAC team at BeMyGuest, building open communication across DevOps, Infra, Data, FE/BE and Support. I set SLOs, runbooks and post-mortems with clear owners; partner with CEOs and C-level on expansion plans; and stay hands-on enough that architecture decisions hold up under code review.",
        related_tech: [
            "OKRs",
            "RFCs",
            "Runbooks",
            "Post-mortems",
            "SLOs",
            "Hiring bar",
            "1:1 mentorship",
            "Quarterly planning",
        ],
        years: 12,
        example_projects: [
            {
                title: "Scaled Aspire engineering from 10+ to 20+ with onboarding playbooks and growth paths",
                url: "https://www.linkedin.com/in/gocanto",
            },
            {
                title: "Led 12-person APAC team at BeMyGuest through full SDLC with platform-agnostic design system",
                url: "https://www.linkedin.com/in/gocanto",
            },
            {
                title: "Partnered with CEO and C-level at Aspire on expansion plans and engineering scaling",
                url: "https://www.linkedin.com/in/gocanto",
            },
        ],
    },
    {
        uuid: "e5f6a1b2-c3d4-1234-5678-90abcdef1234",
        percentage: 95,
        item: "Go (Programming Language)",
        description:
            "Hands-on Go for production backends: reverse proxies, high-throughput pipelines, agent platforms, idempotent payment cores. The default for new work.",
        signature: true,
        long_description:
            "Go is my default for new backend work. I lean on it for reverse proxies that wrap legacy banking cores, high-throughput streaming pipelines, agent orchestration platforms, and idempotent payment modules. The toolchain (testing, profiling, race detector, build determinism) lets me ship regulated systems with confidence, and the runtime keeps tail latencies predictable under load.",
        related_tech: [
            "net/http",
            "context",
            "errgroup",
            "Kafka",
            "Redis Streams",
            "PostgreSQL",
            "gRPC",
            "OpenTelemetry",
        ],
        years: 8,
        example_projects: [
            {
                title: "Banking core reverse proxy with auth, caching, circuit breakers, audit log on every call",
                url: "https://www.linkedin.com/in/gocanto",
            },
            {
                title: "Idempotent payment intake service",
                url: "https://www.linkedin.com/in/gocanto",
            },
            {
                title: "Agentic orchestrator with tool registry and signed event chains",
                url: "https://github.com/oullin/workflow",
            },
        ],
    },
    {
        uuid: "e5f6a1b2-c3d4-7890-1234-901234567890",
        percentage: 95,
        item: "System Design",
        description:
            "Architecting regulated backends end-to-end: contracts, boundaries, data flow, failure modes. Designed for audit and operated under load.",
        signature: true,
        long_description:
            "Software architecture treated as a working contract, not a diagram. I design regulated backends end-to-end: bounded contexts, typed contracts at every boundary, explicit data flow, named failure modes, and SLOs that travel with the service. The result holds up under audit and under load: monolith-to-microservices at Aspire, multi-protocol ingress layers at Silverlake, platform-agnostic UI/SDK at Perx. Every decision shows its work in an RFC, then in code.",
        related_tech: [
            "RFCs",
            "DDD",
            "Contracts",
            "Event sourcing",
            "OpenAPI",
            "gRPC",
            "Kafka",
            "PostgreSQL",
            "Helm",
        ],
        years: 12,
        example_projects: [
            {
                title: "Monolith-to-microservices migration at Aspire for independent scaling and clear ownership",
                url: "https://www.linkedin.com/in/gocanto",
            },
            {
                title: "Multi-protocol ingress layer (HTTP, Kafka, Redis Streams, RabbitMQ) for banking core protection",
                url: "https://www.linkedin.com/in/gocanto",
            },
            {
                title: "Platform-agnostic UI shell + SDK with feature flags and design tokens for brandable deployments",
                url: "https://www.linkedin.com/in/gocanto",
            },
        ],
    },
    {
        uuid: "c3d4e5f6-a1b2-5678-9012-cdef12345678",
        percentage: 92,
        item: "E-commerce Architecture",
        description:
            "Multi-tenant checkout, modular payment adapters, idempotent flows, OpenAPI-driven partner integrations. SaaS commerce designed to scale without breaking reconciliation.",
        signature: true,
        long_description:
            "End-to-end commerce platforms designed for SaaS multi-tenancy. I’ve owned subscription billing with proration and upgrade/downgrade rules, modular payment adapters across 10+ gateways, eTicket lifecycle with audit trails, OpenAPI partner integrations with contract tests, and a multi-currency eWallet with clean ledgering and finance reports. Checkout is idempotent, capacity-aware and resilient to provider blips, without trading off UX.",
        related_tech: [
            "Vue.js",
            "TypeScript",
            "Laravel",
            "Stripe",
            "Adyen",
            "PayPal",
            "WeChat",
            "PayDollar",
            "OpenAPI",
        ],
        years: 10,
        example_projects: [
            {
                title: "Multi-tenant checkout with 10+ payment gateways and standardised failover paths at BeMyGuest",
                url: "https://www.linkedin.com/in/gocanto",
            },
            {
                title: "Capacity Calendar & Reservation Portal with real-time slot discovery and capacity controls",
                url: "https://www.linkedin.com/in/gocanto",
            },
            {
                title: "Multi-currency eWallet for partner payments with ledgering and reconciliation reports",
                url: "https://www.linkedin.com/in/gocanto",
            },
        ],
    },
    {
        uuid: "f6a1b2c3-d4e5-6789-0123-890123456789",
        percentage: 92,
        item: "AI (Artificial Intelligence)",
        description:
            "Hands-on agentic engineering: orchestrators, tool registries, prompt caching, structured output, knowledge bases. Shipping AI products in regulated contexts, not slideware.",
        signature: true,
        long_description:
            "AI shipped as product, not as a demo. I architect agentic systems with typed tool registries (MCP), prompt caching, streaming structured output, JSON-mode validation and knowledge bases that respect data boundaries. Provider abstraction so models swap without product changes. Guidance for SMBs through pragmatic AI adoption, translating capabilities into clear, operational tools, with the same hardening I apply to regulated banking systems.",
        related_tech: [
            "MCP",
            "Anthropic SDK",
            "OpenAI SDK",
            "Go",
            "TypeScript",
            "Vector stores",
            "Prompt caching",
            "JSON schema",
        ],
        years: 3,
        example_projects: [
            {
                title: "Custom AI products with Go data-aggregation pipelines for high-throughput, low-latency delivery",
                url: "https://github.com/oullin/api",
            },
            {
                title: "MCP server exposing internal tools to agents with provider-agnostic abstraction",
                url: "https://github.com/gocanto",
            },
            {
                title: "Pragmatic AI adoption playbook for SMBs translating capabilities into operational tools",
                url: "https://www.linkedin.com/in/gocanto",
            },
        ],
    },
    {
        uuid: "e5f6a1b2-c3d4-1234-5678-345678901234",
        percentage: 90,
        item: "AS/400 Modernisation",
        description:
            "Wrapping legacy banking cores (AS/400, VCOS, COBOL/RPG) with Go reverse proxies: auth, caching, rate limiting, circuit breakers, audit log on every call. Modernise the surface, leave the core.",
        signature: true,
        long_description:
            "Modernising legacy banking cores without touching them. I wrap AS/400, VCOS, and COBOL/RPG systems with Go reverse proxies that own authentication, caching, rate limiting, circuit breakers, and an audit log on every call. The core stays where it is; the surface gets a modern contract, observability, and graceful degradation. Migration risk drops because we never rip-and-replace.",
        related_tech: [
            "Go",
            "COBOL/RPG",
            "VCOS",
            "DB2/400",
            "IBM i",
            "Redis",
            "Kafka",
            "OpenTelemetry",
        ],
        years: 6,
        example_projects: [
            {
                title: "Reverse proxy layer fronting an AS/400 core processor in production banking",
                url: "https://www.linkedin.com/in/gocanto",
            },
            {
                title: "Audit-log streaming pipeline from VCOS into a queryable event store",
                url: "https://www.linkedin.com/in/gocanto",
            },
            {
                title: "Circuit breakers and retry budgets shielding downstream COBOL services",
                url: "https://www.linkedin.com/in/gocanto",
            },
        ],
    },
    {
        uuid: "8f3a1c20-9e7b-4d52-b8a4-c1d2e3f405a1",
        percentage: 92,
        item: "Agentic Orchestration",
        description:
            "Internal agent platforms with orchestrators, tool registries, audit logs, and reproducible runs. Fail-closed validators, signed event chains, no silent failures.",
        signature: true,
        long_description:
            "Internal agent platforms designed for regulated environments. Orchestrators schedule tool calls against a typed registry, every step writes to a tamper-evident audit log, and runs are reproducible from the original event stream. Validators fail closed by default, event chains are cryptographically signed, and silent failures are treated as bugs, not as resilience.",
        related_tech: [
            "MCP",
            "Go",
            "JSON Schema",
            "OpenTelemetry",
            "Postgres",
            "Kafka",
            "Anthropic SDK",
        ],
        years: 3,
        example_projects: [
            {
                title: "MCP-based tool registry exposing internal services to agents",
                url: "https://github.com/gocanto",
            },
            {
                title: "Reproducible-run orchestrator with signed event chains",
                url: "https://github.com/oullin/workflow",
            },
            {
                title: "Fail-closed validator layer for regulated agent workflows",
                url: "https://www.linkedin.com/in/gocanto",
            },
        ],
    },
    {
        uuid: "6b4d5e2c-71a8-4c39-9f02-d7e1a8b3c4d5",
        percentage: 95,
        item: "Payment Integration",
        description:
            "Production-grade Go modules with idempotency keys, webhook signature verification against provider test vectors, retry-with-backoff that respects Retry-After, and structured error taxonomies.",
        signature: true,
        long_description:
            "Payment integrations that hold up in production. Every mutating call carries an idempotency key. Webhooks are verified against the provider's own test vectors, not hand-rolled approximations. Retries respect Retry-After and back off with jitter. Errors are typed taxonomies that downstream code can pattern-match on, not opaque strings. The result is checkout flows that don't fall over when a provider blips.",
        related_tech: [
            "Stripe",
            "Adyen",
            "NETS",
            "PayPal",
            "WeChat",
            "PayDollar",
            "Go",
            "PostgreSQL",
        ],
        years: 10,
        example_projects: [
            {
                title: "Idempotent multi-provider payment intake with structured error taxonomy",
                url: "https://www.linkedin.com/in/gocanto",
            },
            {
                title: "Webhook receiver verified against vendor test vectors with replay tooling",
                url: "https://www.linkedin.com/in/gocanto",
            },
            {
                title: "Retry-with-backoff scheduler that respects Retry-After across providers",
                url: "https://www.linkedin.com/in/gocanto",
            },
        ],
    },
    {
        uuid: "2c9f1e3a-4b8d-4612-9a57-e3f4051627d8",
        percentage: 92,
        item: "Kafka Event Pipelines",
        description:
            "Kafka producer/consumer pairs with exactly-once consumer semantics, DLQ with replay tooling, transactional outbox patterns, and Helm + Grafana shipped together.",
        signature: true,
        long_description:
            "Kafka pipelines built for at-least-once worlds. Producer/consumer pairs are designed for exactly-once consumer semantics on top of the transactional outbox pattern. Dead-letter queues come with first-class replay tooling so incidents are recoverable, not just observable. Deploys ship as Helm charts with Grafana dashboards and SLO alerts: the pipeline is operable from day one.",
        related_tech: [
            "Apache Kafka",
            "Go",
            "Helm",
            "Grafana",
            "Prometheus",
            "PostgreSQL",
            "Avro",
            "Schema Registry",
        ],
        years: 6,
        example_projects: [
            {
                title: "Transactional outbox + Kafka consumer with exactly-once semantics",
                url: "https://www.linkedin.com/in/gocanto",
            },
            {
                title: "DLQ with replay UI for incident recovery",
                url: "https://www.linkedin.com/in/gocanto",
            },
            {
                title: "Helm chart + Grafana dashboards shipped with the producer/consumer pair",
                url: "https://www.linkedin.com/in/gocanto",
            },
        ],
    },
] as const satisfies readonly ProfileSkillRecord[];
