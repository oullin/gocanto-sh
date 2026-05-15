import type { LinksFixture } from "./types";

export const links = {
    version: "1.0.3",
    data: [
        {
            uuid: "a8a6d3a0-4a8d-4a1f-8a48-3c3b5b6f3a6e",
            handle: "@gocanto",
            url: "https://x.com/gocanto",
            description: "Follow Gustavo's updates on X.",
            name: "x",
        },
        {
            uuid: "d1e9c8b2-3a4d-4e5f-b1a2-c3d4e5f6a7b8",
            handle: "gocanto",
            url: "https://www.linkedin.com/in/gocanto/",
            description: "Connect with Gustavo on LinkedIn.",
            name: "linkedin",
        },
        {
            uuid: "b2a1c3d4-e5f6-4a7b-8c9d-1a2b3c4d5e6f",
            handle: "gocanto",
            url: "https://github.com/gocanto",
            description: "Gustavo's personal GitHub.",
            name: "github",
        },
        {
            uuid: "c1a2b3d4-e5f6-4a7b-8c9d-2a3b4c5d6e7f",
            handle: "oullin",
            url: "https://github.com/oullin",
            description: "Explore Oullin Labs' open source projects on GitHub.",
            name: "github_oullin",
        },
    ],
} as const satisfies LinksFixture;
