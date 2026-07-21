import { describe, expect, it } from "vitest";

import { Projects } from "#domain/projects/projects";

const projectFixture = {
    version: "1.0.0",
    data: [
        {
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
        {
            uuid: "a",
            language: "Go",
            title: "First",
            excerpt: "First project with a very small summary.",
            url: "https://example.com/first",
            is_open_source: false,
            icon: "go",
            published_at: "2024-01-01",
            sort: 1,
        },
    ],
} as const;

describe("project domain", () => {
    it("sorts rows and derives languages", () => {
        const rows = Projects.rows(projectFixture);

        expect(rows.map((row) => row.title)).toEqual(["First", "Second"]);
        expect(Projects.languages(rows)).toEqual(["Go", "TypeScript"]);
    });

    it("filters by selected language", () => {
        const rows = Projects.rows(projectFixture);

        expect(Projects.filter(rows, new Set(["Go"])).map((row) => row.title)).toEqual(["First"]);
    });
});
