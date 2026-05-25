import type { ProjectRecord } from "#store/types";

export const phpProjects = [
    {
        uuid: "00a0a12e-6af0-4f5a-b96d-3c95cc7c365c",
        language: "PHP / Vue",
        title: "Aura Chakra",
        excerpt:
            "A wellness platform exploring the intersection of energy awareness and digital product design, built during a deliberate reset after a decade in high-pressure fintech delivery. The backend is a Laravel API managing user profiles, session history, and content delivery. The frontend is a Vue SPA with a visual language intentionally distinct from the productivity tools I usually build — softer, more tactile, more human. The project was as much a study in product thinking and user empathy as it was a technical exercise.",
        url: "https://github.com/aurachakra",
        is_open_source: false,
        icon: "Sparkles",
        published_at: "2023-10-05",
        sort: 16,
    },
    {
        uuid: "32fd43ce-d957-4ad2-9d71-b57f71444f2a",
        language: "PHP",
        title: "laravel-simple-pdf",
        excerpt:
            "A minimal PDF generation package for Laravel that wraps DOMPDF behind a fluent, expressive interface. Documents are composed from Blade templates, so they inherit the full power of the Laravel view layer — partials, components, conditionals — without any PDF-specific templating language to learn. The goal was to make generating a multi-page, branded document feel as unremarkable as rendering an HTML response. Used in production for contract generation and invoicing across several client projects.",
        url: "https://github.com/gocanto/laravel-simple-pdf",
        is_open_source: true,
        icon: "FileText",
        published_at: "2020-12-26",
        sort: 22,
    },
    {
        uuid: "3ce8b01f-406a-474c-80f3-8426617b42fe",
        language: "PHP",
        title: "http-client",
        excerpt:
            "A resilient PHP HTTP client built for inter-service communication in production environments where downstream unreliability is a given. Wraps Guzzle behind a consistent interface that adds configurable retry logic with backoff, structured request and response logging, and dynamic header injection for auth token propagation. The abstraction was motivated by recurring client work where teams were duplicating the same retry-and-log boilerplate across every service boundary — this library makes the right behaviour the default.",
        url: "https://github.com/gocanto/http-client",
        is_open_source: true,
        icon: "Network",
        published_at: "2022-12-22",
        sort: 17,
    },
    {
        uuid: "e517a966-f7d0-46a1-9ee4-494b38a116e5",
        language: "PHP",
        title: "converter",
        excerpt:
            "An immutable, data-agnostic currency converter for PHP that enforces value-object semantics throughout — no raw floats, no mutation, no hidden coupling to any specific exchange-rate API. Conversion amounts are wrapped in typed value objects that carry currency context, making invalid operations fail at the method boundary rather than silently producing wrong numbers. The library predates the Go port and established the interface design that was later validated in that second implementation.",
        url: "https://github.com/gocanto/converter",
        is_open_source: true,
        icon: "RefreshCw",
        published_at: "2019-06-11",
        sort: 23,
    },
    {
        uuid: "928ac7e8-d0ba-4075-9c22-67050ab03755",
        language: "PHP",
        title: "Laravel Framework — Contributions",
        excerpt:
            "Merged pull requests to the Laravel core across the HTTP, routing, and validation layers — focused on edge-case correctness rather than headline features. Contributions included fixing subtle behavioural inconsistencies in request input handling, improving API surface consistency in the router, and tightening documentation where the specified and actual behaviour had drifted apart. Contributing to a codebase used by millions of developers demands a different standard of care than internal work: every change is load-bearing for someone else's production system.",
        url: "https://github.com/laravel/framework/pulls?q=is%3Apr+is%3Aclosed+author%3Agocanto",
        is_open_source: true,
        icon: "GitPullRequest",
        published_at: "2022-09-15",
        sort: 18,
    },
] as const satisfies readonly ProjectRecord[];
