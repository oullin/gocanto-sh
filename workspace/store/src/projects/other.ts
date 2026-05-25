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
        sort: 6,
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
        sort: 9,
    },
] as const satisfies readonly ProjectRecord[];
