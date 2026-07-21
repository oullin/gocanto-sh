import { describe, expect, it } from "vitest";

import { SearchCorpus } from "#domain/search/corpus";

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

const recommendationFixture = {
    version: "1.0.0",
    data: [
        {
            uuid: "old",
            relation: "Manager",
            text: "<p>Great work.</p>",
            person: {
                avatar: "old.jpg",
                full_name: "Old Person",
                company: "Old Co",
                designation: "CTO",
            },
            created_at: "2022-01-01",
            updated_at: "2022-01-01",
            featured: 0,
        },
        {
            uuid: "new",
            relation: "Peer",
            text: "Excellent.",
            person: {
                avatar: "new.jpg",
                full_name: "New Person",
                company: "New Co",
                designation: "Lead",
            },
            created_at: "2024-01-01",
            updated_at: "2024-01-01",
            featured: 1,
        },
    ],
} as const;

describe("search domain", () => {
    it("builds search corpus entries", () => {
        const corpus = SearchCorpus.from({
            projects: projectFixture,
            recommendations: recommendationFixture,
            experience: { version: "1.0.0", data: [] },
            profile: {
                version: "1.0.0",
                data: {
                    nickname: "gc",
                    handle: "gocanto",
                    name: "Gocanto",
                    email: "hello@example.com",
                    profession: "Engineer",
                    skills: [],
                },
            },
            education: { version: "1.0.0", data: [] },
            talks: { version: "1.0.0", data: [] },
            links: { version: "1.0.0", data: [] },
        });

        expect(corpus.projects[0]?.payload.kind).toBe("Project");
    });
});
