import { describe, expect, it } from "vitest";

import type {
    ExperienceFixture,
    ProjectsFixture,
    RecommendationsFixture,
    TalksFixture,
} from "@gocanto/store";

import { computeLastmod, renderSitemap } from "../sitemap";

const emptySources = {
    projects: { version: "1.0.0", data: [] } satisfies ProjectsFixture,
    experience: { version: "1.0.0", data: [] } satisfies ExperienceFixture,
    recommendations: { version: "1.0.0", data: [] } satisfies RecommendationsFixture,
    talks: { version: "1.0.0", data: [] } satisfies TalksFixture,
};

describe("computeLastmod", () => {
    it("falls back to today when there are no candidates", () => {
        const out = computeLastmod(emptySources);
        const today = new Date().toISOString().slice(0, 10);

        expect(out).toBe(today);
    });

    it("picks the latest date across projects, recommendations, and talks", () => {
        const out = computeLastmod({
            projects: {
                version: "1.0.0",
                data: [
                    {
                        uuid: "p",
                        language: "Go",
                        title: "T",
                        excerpt: "",
                        url: "u",
                        is_open_source: true,
                        icon: "i",
                        published_at: "2024-06-01",
                        sort: 1,
                    },
                ],
            },
            experience: emptySources.experience,
            recommendations: {
                version: "1.0.0",
                data: [
                    {
                        uuid: "r",
                        relation: "rel",
                        text: "t",
                        person: { avatar: "a", full_name: "n", company: "c", designation: "d" },
                        created_at: "2024-01-01",
                        updated_at: "2025-03-10",
                        featured: 0,
                    },
                ],
            },
            talks: {
                version: "1.0.0",
                data: [
                    {
                        uuid: "tk",
                        subject: "s",
                        title: "t",
                        url: "u",
                        photo: "p",
                        location: "l",
                        created_at: "2025-01-01",
                        updated_at: "2025-02-01",
                    },
                ],
            },
        });

        expect(out).toBe("2025-03-10");
    });

    it("skips entries that are not parseable dates", () => {
        const out = computeLastmod({
            ...emptySources,
            projects: {
                version: "1.0.0",
                data: [
                    {
                        uuid: "p",
                        language: "Go",
                        title: "T",
                        excerpt: "",
                        url: "u",
                        is_open_source: true,
                        icon: "i",
                        published_at: "not-a-date",
                        sort: 1,
                    },
                ],
            },
        });

        const today = new Date().toISOString().slice(0, 10);

        expect(out).toBe(today);
    });
});

describe("renderSitemap", () => {
    const xml = renderSitemap("https://gocanto.sh", "2025-05-19");

    it("opens with the XML prolog and urlset", () => {
        expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<urlset')).toBe(true);
        expect(xml.trimEnd().endsWith("</urlset>")).toBe(true);
    });

    it("includes the root, all 8 markdown pages, and llms.txt (10 URLs)", () => {
        const matches = xml.match(/<url>/g) ?? [];

        expect(matches.length).toBe(10);

        const expectedLocs = [
            "https://gocanto.sh/",
            "https://gocanto.sh/index.md",
            "https://gocanto.sh/profile.md",
            "https://gocanto.sh/experience.md",
            "https://gocanto.sh/projects.md",
            "https://gocanto.sh/education.md",
            "https://gocanto.sh/talks.md",
            "https://gocanto.sh/recommendations.md",
            "https://gocanto.sh/links.md",
            "https://gocanto.sh/llms.txt",
        ];

        for (const loc of expectedLocs) {
            expect(xml).toContain(`<loc>${loc}</loc>`);
        }
    });

    it("stamps the lastmod on every entry", () => {
        const matches = xml.match(/<lastmod>2025-05-19<\/lastmod>/g) ?? [];

        expect(matches.length).toBe(10);
    });
});
