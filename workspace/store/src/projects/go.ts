import type { ProjectRecord } from "#store/types";

export const goProjects = [
    {
        uuid: "dc67854e-c8bd-4461-baba-8972bee7bfb5",
        language: "Go",
        title: "users-grpc-service",
        excerpt:
            "A reference gRPC service in Go implementing both server and client roles, built to show contract design between distributed services. Identity and session operations sit behind a typed protobuf interface, so the service is easy to consume, mock, or swap behind an API gateway. Structured logging and defined error codes throughout keep distributed traces readable. A useful starting point for any Go service that needs to join a gRPC mesh.",
        url: "https://github.com/gocanto/users-grpc-service",
        is_open_source: true,
        icon: "Users",
        published_at: "2025-04-22",
        sort: 13,
    },
    {
        uuid: "98b5d71a-1c78-4639-a9ed-343a8ba8c328",
        language: "Go",
        title: "converter-go",
        excerpt:
            "A data-agnostic currency converter in Go that takes any exchange-rate provider through a defined interface, keeping business logic decoupled from third-party API contracts. Conversion operations are value types, not primitive floats, which removes a whole class of precision and mutation bugs at the type level. The port deliberately mirrors the earlier PHP version, to check that the interface held up across languages and runtime models.",
        url: "https://github.com/gocanto/go-converter",
        is_open_source: true,
        icon: "ArrowLeftRight",
        published_at: "2021-10-11",
        sort: 19,
    },
    {
        uuid: "de33dc2a-a710-44a3-9413-e886c0498576",
        language: "Go",
        title: "money",
        excerpt:
            "A Go implementation of Martin Fowler's Money pattern, centred on amount and currency value objects so arithmetic stays explicit and safe across domain boundaries.",
        url: "https://github.com/gocanto/money",
        is_open_source: true,
        icon: "Coins",
        published_at: "2026-01-02",
        sort: 7,
    },
    {
        uuid: "03c3e74a-4ce4-4d86-8104-8f2a6f4f85d0",
        language: "Go",
        title: "skills",
        excerpt:
            "A Go CLI for installing and organising reusable AI agent skills so prompts, setup steps, and repo-specific workflows stay consistent instead of drifting across machines.",
        url: "https://github.com/gocanto/skills",
        is_open_source: true,
        icon: "Bot",
        published_at: "2026-03-03",
        sort: 3,
    },
    {
        uuid: "031e58b1-726f-48f2-8eac-5659e0b9bd4d",
        language: "Go",
        title: "java-spotless",
        excerpt:
            "A Go wrapper around Spotless for Java projects, designed to make formatting automation easier to script inside broader toolchains and CI pipelines.",
        url: "https://github.com/gocanto/java-spotless",
        is_open_source: true,
        icon: "Wand2",
        published_at: "2026-02-26",
        sort: 5,
    },
    {
        uuid: "1f9e6cdb-046f-4d2d-8e31-654e570efd6d",
        language: "Go",
        title: "csv-files-reader",
        excerpt:
            "A small Go utility for reading CSV files with minimal ceremony, useful when the job is controlled ingestion rather than building a full data-processing framework.",
        url: "https://github.com/gocanto/csv-files-reader",
        is_open_source: true,
        icon: "Sheet",
        published_at: "2025-02-26",
        sort: 14,
    },
    {
        uuid: "e7367891-db35-48e7-bc58-6fc4812434d2",
        language: "Go",
        title: "payment-gateway",
        excerpt:
            "A Go payment gateway sandbox focused on provider abstraction and transaction flow handling, structured as a starting point for payment integrations.",
        url: "https://github.com/gocanto/payment-gateway",
        is_open_source: true,
        icon: "CreditCard",
        published_at: "2025-11-22",
        sort: 8,
    },
    {
        uuid: "02dbdd7d-12fe-4aa1-ba46-e5d250fa7a7d",
        language: "Go",
        title: "fmtkit",
        excerpt:
            "A rule-driven formatting pipeline for Go and TypeScript/Vue that goes beyond gofmt, enforcing structure around control flow, declaration ordering, and spacing before handing code to gofmt and goimports, with an embedded oxfmt/oxlint toolchain for the TS side. It makes human-written, generated, and agent-written code land on the same house style in a single pass. Ships as one self-contained binary (Homebrew or GitHub Releases) and a reusable Go engine, with config-driven file discovery, exclusion rules, and agent-friendly output formats for CI and automation.",
        url: "https://github.com/oullin/fmtkit",
        is_open_source: true,
        icon: "Wand2",
        published_at: "2026-03-18",
        sort: 1,
    },
] as const satisfies readonly ProjectRecord[];
