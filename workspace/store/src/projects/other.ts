import type { ProjectRecord } from "#store/types";

export const otherProjects = [
    {
        uuid: "b19c190d-12ca-4469-b067-f843e3b18faf",
        language: "Makefile / Docker",
        title: "to-markdown",
        excerpt:
            "A container-first wrapper around MarkItDown that converts documents to Markdown without requiring a local Python runtime, keeping the tool portable across environments.",
        url: "https://github.com/gocanto/to-markdown",
        is_open_source: true,
        icon: "FileCode2",
        published_at: "2026-02-26",
        sort: 8,
    },
    {
        uuid: "2049877b-c2e3-4fed-968f-9f17bb08e737",
        language: "Shell",
        title: "dot-files",
        excerpt:
            "Personal shell and editor dotfiles captured as code, making terminal setup reproducible and easier to evolve across machines without manual drift.",
        url: "https://github.com/gocanto/dot-files",
        is_open_source: true,
        icon: "Terminal",
        published_at: "2025-10-28",
        sort: 11,
    },
    {
        uuid: "fe76bd46-f48c-4380-a051-f1869bc76b45",
        language: "TypeScript / Workers",
        title: "sasu.sh",
        excerpt:
            "Annotation infrastructure for AI agents, running on Cloudflare Workers. A signed-HTTP primitive built on Web Crypto is shared by the annotator client, the CLI bridge, and the server's webhook fanout, so every event is authenticated, timestamped against replays, and processed exactly once.",
        url: "https://sasu.sh/",
        is_open_source: false,
        icon: "PenLine",
        published_at: "2026-07-18",
        sort: 2,
    },
] as const satisfies readonly ProjectRecord[];
