import type { ProjectRecord } from "../types";

export const oullinProjects = [
    {
        uuid: "538e5f1d-86f0-4071-b270-6aa61a156612",
        language: "Go / Docker",
        title: "Oullin — REST API",
        excerpt:
            "A purpose-built Go API powering content delivery and dynamic data for the Oullin platform. Structured around clean request routing, strict input validation, and a fixture-driven data layer that makes it trivial to swap persistence backends without touching application logic. Designed from the start for predictable latency under load, with no hidden allocations in the hot path. Ships as a single Docker image with zero external config requirements — pull, run, done.",
        url: "https://github.com/oullin/api",
        is_open_source: true,
        icon: "Server",
        published_at: "2025-10-18",
        sort: 10,
    },
    {
        uuid: "94478a19-17a0-4be4-8a66-04c12bdfb554",
        language: "Vue / TypeScript",
        title: "Oullin — Web Client",
        excerpt:
            "The Vue 3 + TypeScript single-page application behind the Oullin platform. Built with Vite, Tailwind CSS v4, and a composable API store that abstracts all remote data access behind a single, type-safe surface. Routing, SEO metadata, and structured JSON-LD are handled declaratively so each page remains focused on content rather than plumbing. shadcn-vue provides the base component primitives, extended with a custom design token system for light and dark mode without a single media query in component code.",
        url: "https://github.com/oullin/web",
        is_open_source: true,
        icon: "Globe",
        published_at: "2025-10-18",
        sort: 11,
    },
    {
        uuid: "e8ed4398-eb4e-4c72-a647-c862e0aae784",
        language: "Go / Docker",
        title: "Oullin — Infrastructure",
        excerpt:
            "Docker-based deployment pipeline for the full Oullin stack — API, web client, and any future services. The core design principle is environment parity: if it works locally it works in production, with no special-casing at any layer. A composable Makefile wraps common operations so the cognitive overhead of managing multi-service deployments collapses to a handful of muscle-memory commands. Reproducible builds are enforced through pinned base images and explicit dependency resolution.",
        url: "https://github.com/oullin/infra",
        is_open_source: true,
        icon: "Box",
        published_at: "2025-10-18",
        sort: 12,
    },
    {
        uuid: "e00a72b2-211d-4650-b22d-88dbdcd49cb9",
        language: "Go",
        title: "Oullin — Workflow",
        excerpt:
            "A production-grade state machine and Petri Net workflow engine for Go, built to model complex domain object lifecycles without coupling state logic to business rules. Transitions are declared explicitly with guard conditions and side-effect hooks, making illegal state changes impossible by construction rather than by convention. The engine ships with a full audit trail, thread-safe concurrent state lookups, and Graphviz export for visualising transition graphs — useful both in debugging and in communicating system behaviour to non-technical stakeholders.",
        url: "https://github.com/oullin/workflow",
        is_open_source: true,
        icon: "GitBranch",
        published_at: "2026-03-14",
        sort: 2,
    },
] as const satisfies readonly ProjectRecord[];
