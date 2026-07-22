import { describe, expect, it } from "vitest";
import { Sitemap } from "#llms/sitemap/sitemap";

import type {
    ExperienceFixture,
    ProfileFixture,
    ProjectsFixture,
    RecommendationsFixture,
    TalksFixture,
} from "@gocanto/store";

const emptySources = {
    profile: {
        version: "1.0.0",
        data: {
            nickname: "gus",
            handle: "gocanto",
            name: "Gustavo Ocanto",
            email: "hi@example.com",
            profession: "Software Architect",
            skills: [],
        },
    } satisfies ProfileFixture,
    projects: { version: "1.0.0", data: [] } satisfies ProjectsFixture,
    experience: { version: "1.0.0", data: [] } satisfies ExperienceFixture,
    recommendations: { version: "1.0.0", data: [] } satisfies RecommendationsFixture,
    talks: { version: "1.0.0", data: [] } satisfies TalksFixture,
};

describe("Sitemap.lastmod", () => {
    it("falls back to today when there are no candidates", () => {
        const out = Sitemap.lastmod(emptySources);
        const today = new Date().toISOString().slice(0, 10);

        expect(out).toBe(today);
    });

    it("picks the latest date across projects, recommendations, and talks", () => {
        const out = Sitemap.lastmod({
            profile: emptySources.profile,
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

    it("normalizes date-only values as UTC", () => {
        const out = Sitemap.lastmod({
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
                        published_at: "2024-06-01",
                        sort: 1,
                    },
                ],
            },
        });

        expect(out).toBe("2024-06-01");
    });

    it("normalizes datetime values with offsets as UTC", () => {
        const out = Sitemap.lastmod({
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
                        published_at: "2024-06-01T23:30:00-02:00",
                        sort: 1,
                    },
                ],
            },
        });

        expect(out).toBe("2024-06-02");
    });

    it("excludes empty-string dates from the candidates", () => {
        const out = Sitemap.lastmod({
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
                        published_at: "",
                        sort: 1,
                    },
                ],
            },
        });

        const today = new Date().toISOString().slice(0, 10);

        expect(out).toBe(today);
    });

    it("skips entries that are not parseable dates", () => {
        const out = Sitemap.lastmod({
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

describe("Sitemap.render", () => {
    const xml = Sitemap.render("https://gocanto.sh", "2025-05-19");

    it("opens with the XML prolog and urlset", () => {
        expect(
            xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<urlset'),
        ).toBe(true);
        expect(
            xml.trimEnd().endsWith("</urlset>"),
        ).toBe(true);
    });

    it("includes only the canonical root, resume, and expertise HTML pages", () => {
        const matches = xml.match(/<url>/g) ?? [];

        expect(matches.length).toBe(5);

        const expectedLocs = [
            "https://gocanto.sh/",
            "https://gocanto.sh/resume",
            "https://gocanto.sh/expertise/regulated-ai-systems",
            "https://gocanto.sh/expertise/banking-core-modernisation",
            "https://gocanto.sh/expertise/payment-systems",
        ];

        for (const loc of expectedLocs) {
            expect(xml).toContain(`<loc>${loc}</loc>`);
        }
    });

    it("stamps the lastmod on every entry", () => {
        const matches = xml.match(/<lastmod>2025-05-19<\/lastmod>/g) ?? [];

        expect(matches.length).toBe(5);
    });
});
