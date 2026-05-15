import type { ProfileFixture } from "./types"

export const profile = {
  "version": "1.0.3",
  "data": {
    "nickname": "gus",
    "handle": "gocanto",
    "name": "Gustavo Ocanto",
    "email": "gus@oullin.io",
    "profession": "Software Architect & Principal Engineer",
    "skills": [
      {
        "uuid": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "percentage": 92,
        "item": "Leadership",
        "description": "Engineering leadership across banking, fintech and SaaS — squads, SLOs, hiring bar, on-call, growth plans. Hands-on enough to land technical decisions, structured enough to scale teams.",
        "signature": true,
        "long_description": "I lead engineering teams the way I write services: with clear contracts, predictable cadence, and observability built in. Scaled groups from 10 to 20+ at Aspire and ran a 12-person APAC team at BeMyGuest, building open communication across DevOps, Infra, Data, FE/BE and Support. I set SLOs, runbooks and post-mortems with clear owners; partner with CEOs and C-level on expansion plans; and stay hands-on enough that architecture decisions hold up under code review.",
        "related_tech": ["OKRs", "RFCs", "Runbooks", "Post-mortems", "SLOs", "Hiring bar", "1:1 mentorship", "Quarterly planning"],
        "years": 12,
        "example_projects": [
          { "title": "Scaled Aspire engineering from 10+ to 20+ with onboarding playbooks and growth paths", "url": "https://www.linkedin.com/in/gocanto" },
          { "title": "Led 12-person APAC team at BeMyGuest through full SDLC with platform-agnostic design system", "url": "https://www.linkedin.com/in/gocanto" },
          { "title": "Partnered with CEO and C-level at Aspire on expansion plans and engineering scaling", "url": "https://www.linkedin.com/in/gocanto" }
        ]
      },
      {
        "uuid": "b2c3d4e5-f6a1-8901-2345-67890abcdef1",
        "percentage": 90,
        "item": "Management",
        "description": "The process of dealing with or controlling things or people to achieve business objectives."
      },
      {
        "uuid": "c3d4e5f6-a1b2-9012-3456-7890abcdef12",
        "percentage": 90,
        "item": "Strategic Planning",
        "description": "Defining an organisation's direction and making decisions on allocating resources to pursue this strategy."
      },
      {
        "uuid": "d4e5f6a1-b2c3-0123-4567-890abcdef123",
        "percentage": 95,
        "item": "Communication",
        "description": "The imparting or exchanging of information, ideas, or news within a team or organisation."
      },
      {
        "uuid": "e5f6a1b2-c3d4-1234-5678-90abcdef1234",
        "percentage": 95,
        "item": "Go (Programming Language)",
        "description": "Hands-on Go for production backends — reverse proxies, high-throughput pipelines, agent platforms, idempotent payment cores. The default for new work.",
        "signature": true,
        "long_description": "Go is my default for new backend work. I lean on it for reverse proxies that wrap legacy banking cores, high-throughput streaming pipelines, agent orchestration platforms, and idempotent payment modules. The toolchain (testing, profiling, race detector, build determinism) lets me ship regulated systems with confidence, and the runtime keeps tail latencies predictable under load.",
        "related_tech": ["net/http", "context", "errgroup", "Kafka", "Redis Streams", "PostgreSQL", "gRPC", "OpenTelemetry"],
        "years": 8,
        "example_projects": [
          { "title": "Banking core reverse proxy with auth, caching, circuit breakers, audit log on every call", "url": "https://www.linkedin.com/in/gocanto" },
          { "title": "Idempotent payment intake service", "url": "https://www.linkedin.com/in/gocanto" },
          { "title": "Agentic orchestrator with tool registry and signed event chains", "url": "https://github.com/oullin/workflow" }
        ]
      },
      {
        "uuid": "f6a1b2c3-d4e5-2345-6789-0abcdef12345",
        "percentage": 95,
        "item": "PHP",
        "description": "A popular general-purpose scripting language that is especially suited to web development."
      },
      {
        "uuid": "a1b2c3d4-e5f6-3456-7890-abcdef123456",
        "percentage": 95,
        "item": "Cloud Cost Optimisation",
        "description": "The process of reducing cloud spending without negatively impacting performance or reliability."
      },
      {
        "uuid": "e5f6a1b2-c3d4-7890-1234-901234567890",
        "percentage": 95,
        "item": "System Design",
        "description": "Architecting regulated backends end-to-end: contracts, boundaries, data flow, failure modes. Designed for audit and operated under load.",
        "signature": true,
        "long_description": "Software architecture treated as a working contract, not a diagram. I design regulated backends end-to-end — bounded contexts, typed contracts at every boundary, explicit data flow, named failure modes, and SLOs that travel with the service. The result holds up under audit and under load: monolith-to-microservices at Aspire, multi-protocol ingress layers at Silverlake, platform-agnostic UI/SDK at Perx. Every decision shows its work in an RFC, then in code.",
        "related_tech": ["RFCs", "DDD", "Contracts", "Event sourcing", "OpenAPI", "gRPC", "Kafka", "PostgreSQL", "Helm"],
        "years": 12,
        "example_projects": [
          { "title": "Monolith-to-microservices migration at Aspire for independent scaling and clear ownership", "url": "https://www.linkedin.com/in/gocanto" },
          { "title": "Multi-protocol ingress layer (HTTP, Kafka, Redis Streams, RabbitMQ) for banking core protection", "url": "https://www.linkedin.com/in/gocanto" },
          { "title": "Platform-agnostic UI shell + SDK with feature flags and design tokens for brandable deployments", "url": "https://www.linkedin.com/in/gocanto" }
        ]
      },
      {
        "uuid": "c3d4e5f6-a1b2-5678-9012-cdef12345678",
        "percentage": 92,
        "item": "E-commerce Architecture",
        "description": "Multi-tenant checkout, modular payment adapters, idempotent flows, OpenAPI-driven partner integrations. SaaS commerce designed to scale without breaking reconciliation.",
        "signature": true,
        "long_description": "End-to-end commerce platforms designed for SaaS multi-tenancy. I’ve owned subscription billing with proration and upgrade/downgrade rules, modular payment adapters across 10+ gateways, eTicket lifecycle with audit trails, OpenAPI partner integrations with contract tests, and a multi-currency eWallet with clean ledgering and finance reports. Checkout is idempotent, capacity-aware and resilient to provider blips — without trading off UX.",
        "related_tech": ["Vue.js", "TypeScript", "Laravel", "Stripe", "Adyen", "PayPal", "WeChat", "PayDollar", "OpenAPI"],
        "years": 10,
        "example_projects": [
          { "title": "Multi-tenant checkout with 10+ payment gateways and standardised failover paths at BeMyGuest", "url": "https://www.linkedin.com/in/gocanto" },
          { "title": "Capacity Calendar & Reservation Portal with real-time slot discovery and capacity controls", "url": "https://www.linkedin.com/in/gocanto" },
          { "title": "Multi-currency eWallet for partner payments with ledgering and reconciliation reports", "url": "https://www.linkedin.com/in/gocanto" }
        ]
      },
      {
        "uuid": "d4e5f6a1-b2c3-6789-0123-def123456789",
        "percentage": 95,
        "item": "Complex 3rd Party System Integrations",
        "description": "Stripe, Adyen, NETS, PayPal, WeChat, PayDollar, schema registries, banking cores. Contract tests, failover paths, idempotent sync jobs — checkout that doesn't fall over."
      },
      {
        "uuid": "e5f6a1b2-c3d4-7890-1234-ef1234567890",
        "percentage": 85,
        "item": "Scale Engineering Efforts",
        "description": "The practice of expanding and managing engineering teams and infrastructure to support growth."
      },
      {
        "uuid": "f6a1b2c3-d4e5-8901-2345-f12345678901",
        "percentage": 85,
        "item": "SQL Performance Optimisation",
        "description": "Improving the speed and efficiency of queries executed on a relational database."
      },
      {
        "uuid": "a1b2c3d4-e5f6-9012-3456-123456789012",
        "percentage": 85,
        "item": "Mentorship",
        "description": "Guidance provided by a more experienced person to support professional growth."
      },
      {
        "uuid": "b2c3d4e5-f6a1-0123-4567-234567890123",
        "percentage": 80,
        "item": "TypeScript",
        "description": "A strongly typed programming language that builds on JavaScript for better tooling at any scale."
      },
      {
        "uuid": "c3d4e5f6-a1b2-1234-5678-345678901234",
        "percentage": 85,
        "item": "Vue.js",
        "description": "A progressive JavaScript framework used for building user interfaces and single-page applications."
      },
      {
        "uuid": "d4e5f6a1-b2c3-2345-6789-456789012345",
        "percentage": 80,
        "item": "Node.js",
        "description": "A back-end JavaScript runtime environment that executes JavaScript code outside a web browser."
      },
      {
        "uuid": "e5f6a1b2-c3d4-3456-7890-567890123456",
        "percentage": 80,
        "item": "PostgreSQL",
        "description": "A powerful, open-source object-relational database system known for its reliability and features."
      },
      {
        "uuid": "f6a1b2c3-d4e5-4567-8901-678901234567",
        "percentage": 85,
        "item": "MySQL",
        "description": "An open-source relational database management system (RDBMS) widely used in web applications."
      },
      {
        "uuid": "a1b2c3d4-e5f6-5678-9012-789012345678",
        "percentage": 80,
        "item": "Apache Kafka",
        "description": "An open-source distributed event streaming platform for high-performance data pipelines."
      },
      {
        "uuid": "b2c3d4e5-f6a1-6789-0123-890123456789",
        "percentage": 80,
        "item": "Docker",
        "description": "A platform that uses containers to create, deploy, and run applications."
      },
      {
        "uuid": "c3d4e5f6-a1b2-7890-1234-901234567890",
        "percentage": 65,
        "item": "Next.JS",
        "description": "A React framework for building full-stack web applications with server-side rendering."
      },
      {
        "uuid": "d4e5f6a1-b2c3-8901-2345-012345678901",
        "percentage": 55,
        "item": "Nuxt.JS",
        "description": "An intuitive Vue framework for creating server-rendered applications and static sites."
      },
      {
        "uuid": "e5f6a1b2-c3d4-9012-3456-123456789012",
        "percentage": 95,
        "item": "Laravel",
        "description": "A PHP web application framework with expressive, elegant syntax for web development."
      },
      {
        "uuid": "f6a1b2c3-d4e5-0123-4567-234567890123",
        "percentage": 55,
        "item": "Python",
        "description": "A high-level, general-purpose programming language known for its simple syntax."
      },
      {
        "uuid": "a1b2c3d4-e5f6-1234-5678-345678901234",
        "percentage": 75,
        "item": "FastAPI",
        "description": "A modern, high-performance web framework for building APIs with Python."
      },
      {
        "uuid": "b2c3d4e5-f6a1-2345-6789-456789012345",
        "percentage": 95,
        "item": "CI/CD",
        "description": "Continuous Integration and Delivery, the practice of automating the software development and release process."
      },
      {
        "uuid": "c3d4e5f6-a1b2-5678-9012-789012345678",
        "percentage": 75,
        "item": "ETL",
        "description": "Extract, Transform, Load; a data integration process for combining data from multiple sources."
      },
      {
        "uuid": "d4e5f6a1-b2c3-6789-0123-890123456789",
        "percentage": 85,
        "item": "Go Redis Streams",
        "description": "A Redis data structure, accessed via Go, for managing and consuming streams of data."
      },
      {
        "uuid": "c3d4e5f6-a1b2-3456-7890-567890123456",
        "percentage": 90,
        "item": "Recruiting",
        "description": "The process of actively seeking out, finding, and hiring candidates for a specific job."
      },
      {
        "uuid": "d4e5f6a1-b2c3-4567-8901-678901234567",
        "percentage": 90,
        "item": "Training",
        "description": "The action of teaching a person or group a particular skill or type of behaviour."
      },
      {
        "uuid": "e5f6a1b2-c3d4-5678-9012-789012345678",
        "percentage": 70,
        "item": "RabbitMQ",
        "description": "An open-source message broker that implements the Advanced Message Queuing Protocol (AMQP)."
      },
      {
        "uuid": "f6a1b2c3-d4e5-6789-0123-890123456789",
        "percentage": 92,
        "item": "AI (Artificial Intelligence)",
        "description": "Hands-on agentic engineering: orchestrators, tool registries, prompt caching, structured output, knowledge bases. Shipping AI products in regulated contexts, not slideware.",
        "signature": true,
        "long_description": "AI shipped as product, not as a demo. I architect agentic systems with typed tool registries (MCP), prompt caching, streaming structured output, JSON-mode validation and knowledge bases that respect data boundaries. Provider abstraction so models swap without product changes. Guidance for SMBs through pragmatic AI adoption — translating capabilities into clear, operational tools — with the same hardening I apply to regulated banking systems.",
        "related_tech": ["MCP", "Anthropic SDK", "OpenAI SDK", "Go", "TypeScript", "Vector stores", "Prompt caching", "JSON schema"],
        "years": 3,
        "example_projects": [
          { "title": "Custom AI products with Go data-aggregation pipelines for high-throughput, low-latency delivery", "url": "https://github.com/oullin/api" },
          { "title": "MCP server exposing internal tools to agents with provider-agnostic abstraction", "url": "https://github.com/gocanto" },
          { "title": "Pragmatic AI adoption playbook for SMBs translating capabilities into operational tools", "url": "https://www.linkedin.com/in/gocanto" }
        ]
      },
      {
        "uuid": "a1b2c3d4-e5f6-7890-1234-901234567890",
        "percentage": 45,
        "item": "Ruby on Rails",
        "description": "A server-side web application framework written in Ruby that follows the MVC pattern."
      },
      {
        "uuid": "b2c3d4e5-f6a1-8901-2345-012345678901",
        "percentage": 80,
        "item": "Symfony PHP",
        "description": "A set of reusable PHP components and a PHP framework for web projects."
      },
      {
        "uuid": "c3d4e5f6-a1b2-9012-3456-123456789012",
        "percentage": 75,
        "item": "SvelteJS",
        "description": "A component framework that compiles your code to tiny, framework-less vanilla JS."
      },
      {
        "uuid": "d4e5f6a1-b2c3-0123-4567-234567890123",
        "percentage": 55,
        "item": "C/C++",
        "description": "A general-purpose language (C) and its object-oriented successor (C++) known for high performance."
      },
      {
        "uuid": "e5f6a1b2-c3d4-1234-5678-345678901234",
        "percentage": 90,
        "item": "AS/400 Modernisation",
        "description": "Wrapping legacy banking cores (AS/400, VCOS, COBOL/RPG) with Go reverse proxies — auth, caching, rate limiting, circuit breakers, audit log on every call. Modernise the surface, leave the core.",
        "signature": true,
        "long_description": "Modernising legacy banking cores without touching them. I wrap AS/400, VCOS, and COBOL/RPG systems with Go reverse proxies that own authentication, caching, rate limiting, circuit breakers, and an audit log on every call. The core stays where it is; the surface gets a modern contract, observability, and graceful degradation. Migration risk drops because we never rip-and-replace.",
        "related_tech": ["Go", "COBOL/RPG", "VCOS", "DB2/400", "IBM i", "Redis", "Kafka", "OpenTelemetry"],
        "years": 6,
        "example_projects": [
          { "title": "Reverse proxy layer fronting an AS/400 core processor in production banking", "url": "https://www.linkedin.com/in/gocanto" },
          { "title": "Audit-log streaming pipeline from VCOS into a queryable event store", "url": "https://www.linkedin.com/in/gocanto" },
          { "title": "Circuit breakers and retry budgets shielding downstream COBOL services", "url": "https://www.linkedin.com/in/gocanto" }
        ]
      },
      {
        "uuid": "f6a1b2c3-d4e5-2345-6789-456789012345",
        "percentage": 100,
        "item": "Software Engineers",
        "description": "Professionals who apply engineering principles to design, develop, test, and maintain software."
      },
      {
        "uuid": "a1b2c3d4-e5f6-3456-7890-567890123456",
        "percentage": 85,
        "item": "MCP (Model Context Protocol)",
        "description": "Building MCP servers and clients that expose tools and resources to agents over a typed protocol. Provider abstraction so models swap without product changes."
      },
      {
        "uuid": "b2c3d4e5-f6a1-4567-8901-678901234567",
        "percentage": 90,
        "item": "360 Communication",
        "description": "A communication strategy involving feedback from all directions: supervisors, peers, and C-Level."
      },
      {
        "uuid": "8f3a1c20-9e7b-4d52-b8a4-c1d2e3f405a1",
        "percentage": 92,
        "item": "Agentic Orchestration",
        "description": "Internal agent platforms with orchestrators, tool registries, audit logs, and reproducible runs. Fail-closed validators, signed event chains, no silent failures.",
        "signature": true,
        "long_description": "Internal agent platforms designed for regulated environments. Orchestrators schedule tool calls against a typed registry, every step writes to a tamper-evident audit log, and runs are reproducible from the original event stream. Validators fail closed by default, event chains are cryptographically signed, and silent failures are treated as bugs — not as resilience.",
        "related_tech": ["MCP", "Go", "JSON Schema", "OpenTelemetry", "Postgres", "Kafka", "Anthropic SDK"],
        "years": 3,
        "example_projects": [
          { "title": "MCP-based tool registry exposing internal services to agents", "url": "https://github.com/gocanto" },
          { "title": "Reproducible-run orchestrator with signed event chains", "url": "https://github.com/oullin/workflow" },
          { "title": "Fail-closed validator layer for regulated agent workflows", "url": "https://www.linkedin.com/in/gocanto" }
        ]
      },
      {
        "uuid": "6b4d5e2c-71a8-4c39-9f02-d7e1a8b3c4d5",
        "percentage": 95,
        "item": "Payment Integration",
        "description": "Production-grade Go modules with idempotency keys, webhook signature verification against provider test vectors, retry-with-backoff that respects Retry-After, and structured error taxonomies.",
        "signature": true,
        "long_description": "Payment integrations that hold up in production. Every mutating call carries an idempotency key. Webhooks are verified against the provider's own test vectors, not hand-rolled approximations. Retries respect Retry-After and back off with jitter. Errors are typed taxonomies that downstream code can pattern-match on, not opaque strings. The result is checkout flows that don't fall over when a provider blips.",
        "related_tech": ["Stripe", "Adyen", "NETS", "PayPal", "WeChat", "PayDollar", "Go", "PostgreSQL"],
        "years": 10,
        "example_projects": [
          { "title": "Idempotent multi-provider payment intake with structured error taxonomy", "url": "https://www.linkedin.com/in/gocanto" },
          { "title": "Webhook receiver verified against vendor test vectors with replay tooling", "url": "https://www.linkedin.com/in/gocanto" },
          { "title": "Retry-with-backoff scheduler that respects Retry-After across providers", "url": "https://www.linkedin.com/in/gocanto" }
        ]
      },
      {
        "uuid": "2c9f1e3a-4b8d-4612-9a57-e3f4051627d8",
        "percentage": 92,
        "item": "Kafka Event Pipelines",
        "description": "Kafka producer/consumer pairs with exactly-once consumer semantics, DLQ with replay tooling, transactional outbox patterns, and Helm + Grafana shipped together.",
        "signature": true,
        "long_description": "Kafka pipelines built for at-least-once worlds. Producer/consumer pairs are designed for exactly-once consumer semantics on top of the transactional outbox pattern. Dead-letter queues come with first-class replay tooling so incidents are recoverable, not just observable. Deploys ship as Helm charts with Grafana dashboards and SLO alerts — the pipeline is operable from day one.",
        "related_tech": ["Apache Kafka", "Go", "Helm", "Grafana", "Prometheus", "PostgreSQL", "Avro", "Schema Registry"],
        "years": 6,
        "example_projects": [
          { "title": "Transactional outbox + Kafka consumer with exactly-once semantics", "url": "https://www.linkedin.com/in/gocanto" },
          { "title": "DLQ with replay UI for incident recovery", "url": "https://www.linkedin.com/in/gocanto" },
          { "title": "Helm chart + Grafana dashboards shipped with the producer/consumer pair", "url": "https://www.linkedin.com/in/gocanto" }
        ]
      },
      {
        "uuid": "5a1b7c9e-3f4d-4821-b5a6-c8d9e0f1a2b3",
        "percentage": 95,
        "item": "Audit-Trail Architecture",
        "description": "Append-only event logs with cryptographic signatures and replay tooling. Compliance designed in at architecture stage, not retrofitted — every step reproducible, every record permanent."
      },
      {
        "uuid": "9d4e2f7a-8c1b-4530-a692-d3e4f50617c8",
        "percentage": 93,
        "item": "Idempotency & Retry Design",
        "description": "Idempotency keys on every mutating call, retry policies with jitter and Retry-After respect, structured error taxonomies that pattern-match cleanly. Built for at-least-once worlds."
      },
      {
        "uuid": "4f8a2c1e-5d6b-4739-9b8c-a0d1e2f30415",
        "percentage": 88,
        "item": "LLM Tooling",
        "description": "MCP servers, tool calling, prompt caching, streaming responses, JSON-mode validation. Provider abstraction so models swap without product changes."
      }
    ]
  }
} as const satisfies ProfileFixture
