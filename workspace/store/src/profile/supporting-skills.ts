import type { ProfileSkillRecord } from "../types";

export const supportingSkills = [
    {
        uuid: "b2c3d4e5-f6a1-8901-2345-67890abcdef1",
        percentage: 90,
        item: "Management",
        description:
            "The process of dealing with or controlling things or people to achieve business objectives.",
    },
    {
        uuid: "c3d4e5f6-a1b2-9012-3456-7890abcdef12",
        percentage: 90,
        item: "Strategic Planning",
        description:
            "Defining an organisation's direction and making decisions on allocating resources to pursue this strategy.",
    },
    {
        uuid: "d4e5f6a1-b2c3-0123-4567-890abcdef123",
        percentage: 95,
        item: "Communication",
        description:
            "The imparting or exchanging of information, ideas, or news within a team or organisation.",
    },
    {
        uuid: "f6a1b2c3-d4e5-2345-6789-0abcdef12345",
        percentage: 95,
        item: "PHP",
        description:
            "A popular general-purpose scripting language that is especially suited to web development.",
    },
    {
        uuid: "a1b2c3d4-e5f6-3456-7890-abcdef123456",
        percentage: 95,
        item: "Cloud Cost Optimisation",
        description:
            "The process of reducing cloud spending without negatively impacting performance or reliability.",
    },
    {
        uuid: "d4e5f6a1-b2c3-6789-0123-def123456789",
        percentage: 95,
        item: "Complex 3rd Party System Integrations",
        description:
            "Stripe, Adyen, NETS, PayPal, WeChat, PayDollar, schema registries, banking cores. Contract tests, failover paths, idempotent sync jobs — checkout that doesn't fall over.",
    },
    {
        uuid: "e5f6a1b2-c3d4-7890-1234-ef1234567890",
        percentage: 85,
        item: "Scale Engineering Efforts",
        description:
            "The practice of expanding and managing engineering teams and infrastructure to support growth.",
    },
    {
        uuid: "f6a1b2c3-d4e5-8901-2345-f12345678901",
        percentage: 85,
        item: "SQL Performance Optimisation",
        description:
            "Improving the speed and efficiency of queries executed on a relational database.",
    },
    {
        uuid: "a1b2c3d4-e5f6-9012-3456-123456789012",
        percentage: 85,
        item: "Mentorship",
        description:
            "Guidance provided by a more experienced person to support professional growth.",
    },
    {
        uuid: "b2c3d4e5-f6a1-0123-4567-234567890123",
        percentage: 80,
        item: "TypeScript",
        description:
            "A strongly typed programming language that builds on JavaScript for better tooling at any scale.",
    },
    {
        uuid: "c3d4e5f6-a1b2-1234-5678-345678901234",
        percentage: 85,
        item: "Vue.js",
        description:
            "A progressive JavaScript framework used for building user interfaces and single-page applications.",
    },
    {
        uuid: "d4e5f6a1-b2c3-2345-6789-456789012345",
        percentage: 80,
        item: "Node.js",
        description:
            "A back-end JavaScript runtime environment that executes JavaScript code outside a web browser.",
    },
    {
        uuid: "e5f6a1b2-c3d4-3456-7890-567890123456",
        percentage: 80,
        item: "PostgreSQL",
        description:
            "A powerful, open-source object-relational database system known for its reliability and features.",
    },
    {
        uuid: "f6a1b2c3-d4e5-4567-8901-678901234567",
        percentage: 85,
        item: "MySQL",
        description:
            "An open-source relational database management system (RDBMS) widely used in web applications.",
    },
    {
        uuid: "a1b2c3d4-e5f6-5678-9012-789012345678",
        percentage: 80,
        item: "Apache Kafka",
        description:
            "An open-source distributed event streaming platform for high-performance data pipelines.",
    },
    {
        uuid: "b2c3d4e5-f6a1-6789-0123-890123456789",
        percentage: 80,
        item: "Docker",
        description: "A platform that uses containers to create, deploy, and run applications.",
    },
    {
        uuid: "c3d4e5f6-a1b2-7890-1234-901234567890",
        percentage: 65,
        item: "Next.JS",
        description:
            "A React framework for building full-stack web applications with server-side rendering.",
    },
    {
        uuid: "d4e5f6a1-b2c3-8901-2345-012345678901",
        percentage: 55,
        item: "Nuxt.JS",
        description:
            "An intuitive Vue framework for creating server-rendered applications and static sites.",
    },
    {
        uuid: "e5f6a1b2-c3d4-9012-3456-123456789012",
        percentage: 95,
        item: "Laravel",
        description:
            "A PHP web application framework with expressive, elegant syntax for web development.",
    },
    {
        uuid: "f6a1b2c3-d4e5-0123-4567-234567890123",
        percentage: 55,
        item: "Python",
        description:
            "A high-level, general-purpose programming language known for its simple syntax.",
    },
    {
        uuid: "a1b2c3d4-e5f6-1234-5678-345678901234",
        percentage: 75,
        item: "FastAPI",
        description: "A modern, high-performance web framework for building APIs with Python.",
    },
    {
        uuid: "b2c3d4e5-f6a1-2345-6789-456789012345",
        percentage: 95,
        item: "CI/CD",
        description:
            "Continuous Integration and Delivery, the practice of automating the software development and release process.",
    },
    {
        uuid: "c3d4e5f6-a1b2-5678-9012-789012345678",
        percentage: 75,
        item: "ETL",
        description:
            "Extract, Transform, Load; a data integration process for combining data from multiple sources.",
    },
    {
        uuid: "d4e5f6a1-b2c3-6789-0123-890123456789",
        percentage: 85,
        item: "Go Redis Streams",
        description:
            "A Redis data structure, accessed via Go, for managing and consuming streams of data.",
    },
    {
        uuid: "c3d4e5f6-a1b2-3456-7890-567890123456",
        percentage: 90,
        item: "Recruiting",
        description:
            "The process of actively seeking out, finding, and hiring candidates for a specific job.",
    },
    {
        uuid: "d4e5f6a1-b2c3-4567-8901-678901234567",
        percentage: 90,
        item: "Training",
        description:
            "The action of teaching a person or group a particular skill or type of behaviour.",
    },
    {
        uuid: "e5f6a1b2-c3d4-5678-9012-789012345678",
        percentage: 70,
        item: "RabbitMQ",
        description:
            "An open-source message broker that implements the Advanced Message Queuing Protocol (AMQP).",
    },
    {
        uuid: "a1b2c3d4-e5f6-7890-1234-901234567890",
        percentage: 45,
        item: "Ruby on Rails",
        description:
            "A server-side web application framework written in Ruby that follows the MVC pattern.",
    },
    {
        uuid: "b2c3d4e5-f6a1-8901-2345-012345678901",
        percentage: 80,
        item: "Symfony PHP",
        description: "A set of reusable PHP components and a PHP framework for web projects.",
    },
    {
        uuid: "c3d4e5f6-a1b2-9012-3456-123456789012",
        percentage: 75,
        item: "SvelteJS",
        description:
            "A component framework that compiles your code to tiny, framework-less vanilla JS.",
    },
    {
        uuid: "d4e5f6a1-b2c3-0123-4567-234567890123",
        percentage: 55,
        item: "C/C++",
        description:
            "A general-purpose language (C) and its object-oriented successor (C++) known for high performance.",
    },
    {
        uuid: "f6a1b2c3-d4e5-2345-6789-456789012345",
        percentage: 100,
        item: "Software Engineers",
        description:
            "Professionals who apply engineering principles to design, develop, test, and maintain software.",
    },
    {
        uuid: "a1b2c3d4-e5f6-3456-7890-567890123456",
        percentage: 85,
        item: "MCP (Model Context Protocol)",
        description:
            "Building MCP servers and clients that expose tools and resources to agents over a typed protocol. Provider abstraction so models swap without product changes.",
    },
    {
        uuid: "b2c3d4e5-f6a1-4567-8901-678901234567",
        percentage: 90,
        item: "360 Communication",
        description:
            "A communication strategy involving feedback from all directions: supervisors, peers, and C-Level.",
    },
    {
        uuid: "5a1b7c9e-3f4d-4821-b5a6-c8d9e0f1a2b3",
        percentage: 95,
        item: "Audit-Trail Architecture",
        description:
            "Append-only event logs with cryptographic signatures and replay tooling. Compliance designed in at architecture stage, not retrofitted — every step reproducible, every record permanent.",
    },
    {
        uuid: "9d4e2f7a-8c1b-4530-a692-d3e4f50617c8",
        percentage: 93,
        item: "Idempotency & Retry Design",
        description:
            "Idempotency keys on every mutating call, retry policies with jitter and Retry-After respect, structured error taxonomies that pattern-match cleanly. Built for at-least-once worlds.",
    },
    {
        uuid: "4f8a2c1e-5d6b-4739-9b8c-a0d1e2f30415",
        percentage: 88,
        item: "LLM Tooling",
        description:
            "MCP servers, tool calling, prompt caching, streaming responses, JSON-mode validation. Provider abstraction so models swap without product changes.",
    },
] as const satisfies readonly ProfileSkillRecord[];
