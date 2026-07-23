import type { ProjectRecord } from "#store/types";

export const oullinProjects = [
    {
        uuid: "538e5f1d-86f0-4071-b270-6aa61a156612",
        language: "Go / Docker",
        title: "Oullin: REST API",
        excerpt:
            "A Go API powering content delivery and dynamic data for the Oullin platform. Request routing, strict input validation, and a fixture-driven data layer that swaps persistence backends without touching application logic. Built for predictable latency under load, and it ships as a single Docker image that runs with no external config.",
        url: "https://github.com/oullin/api",
        is_open_source: true,
        icon: "Server",
        published_at: "2025-10-18",
        sort: 10,
    },
    {
        uuid: "94478a19-17a0-4be4-8a66-04c12bdfb554",
        language: "Vue / TypeScript",
        title: "Oullin: Web Client",
        excerpt:
            "The Vue 3 + TypeScript single-page application behind the Oullin platform. Built with Vite, Tailwind CSS v4, and a composable API store that puts all remote data access behind one type-safe surface. Routing, SEO metadata, and structured JSON-LD are declarative, so each page stays focused on content. shadcn-vue supplies the base component primitives, extended with a custom design token system that handles light and dark mode without media queries in component code.",
        url: "https://github.com/oullin/web",
        is_open_source: true,
        icon: "Globe",
        published_at: "2025-10-18",
        sort: 11,
    },
    {
        uuid: "e8ed4398-eb4e-4c72-a647-c862e0aae784",
        language: "Go / Docker",
        title: "Oullin: Infrastructure",
        excerpt:
            "Docker-based deployment pipeline for the full Oullin stack: API, web client, and any future services. It holds one line: if it works locally it works in production, with no special-casing at any layer. A Makefile wraps common operations, so managing a multi-service deployment comes down to a handful of commands. Pinned base images and explicit dependency resolution keep the builds reproducible.",
        url: "https://github.com/oullin/infra",
        is_open_source: true,
        icon: "Box",
        published_at: "2025-10-18",
        sort: 12,
    },
    {
        uuid: "e00a72b2-211d-4650-b22d-88dbdcd49cb9",
        language: "Go",
        title: "Oullin: Workflow",
        excerpt:
            "A state machine and Petri Net workflow engine for Go, built to model domain object lifecycles without coupling state logic to business rules. Transitions are declared with guard conditions and side-effect hooks, so illegal state changes fail at compile time instead of in review. The engine ships with a full audit trail, thread-safe concurrent state lookups, and Graphviz export for visualising transition graphs, which helps both in debugging and in showing system behaviour to non-technical stakeholders.",
        url: "https://github.com/oullin/workflow",
        is_open_source: true,
        icon: "GitBranch",
        published_at: "2026-03-14",
        sort: 2,
    },
] as const satisfies readonly ProjectRecord[];
