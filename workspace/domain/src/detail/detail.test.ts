import { describe, expect, it } from "vitest";

import { DetailView } from "#domain/detail/detail";

describe("detail domain", () => {
    it("builds detail headers", () => {
        const header = DetailView.headerFor({
            kind: "Project",
            data: {
                uuid: "b",
                language: "TypeScript",
                title: "Second",
                excerpt: "Second project. Extra details.",
                url: "https://example.com/second",
                is_open_source: true,
                icon: "ts",
                published_at: "2024-02-01",
                sort: 2,
            },
        });

        expect(header?.title).toBe("Second");
    });

    it("labels project links by repository availability", () => {
        expect(
            DetailView.projectLinkLabel(true),
        ).toBe("View repository");
        expect(
            DetailView.projectLinkLabel(false),
        ).toBe("View site");
    });
});
