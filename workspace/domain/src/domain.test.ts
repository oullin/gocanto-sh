import { describe, expect, it } from "vitest";

import { buildSearchCorpus } from "./search";
import { filterProjectRows, listProjectLanguages, listProjectRows } from "./projects";
import { listFeaturedWorkCards } from "./work";
import { searchableText, stripHtml } from "./text";
import {
    listRecommendationsNewestFirst,
    listTestimonials,
    uniqueRecommendations,
} from "./recommendations";
import { listSignatureSkillCells, skillChipVariant, skillInitials } from "./skills";
import { detailHeaderFor } from "./detail";

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

describe("text helpers", () => {
    it("strips HTML entities and tags", () => {
        expect(stripHtml("<p>Go &amp; TS<br>Done</p>")).toBe("Go & TS\nDone");
    });

    it("keeps compact search variants for punctuation-heavy queries", () => {
        expect(searchableText("AS/400", "Node.js")).toContain("AS400Nodejs");
    });
});

describe("project domain", () => {
    it("sorts rows and derives languages", () => {
        const rows = listProjectRows(projectFixture);

        expect(rows.map((row) => row.title)).toEqual(["First", "Second"]);
        expect(listProjectLanguages(rows)).toEqual(["Go", "TypeScript"]);
    });

    it("filters by selected language", () => {
        const rows = listProjectRows(projectFixture);

        expect(filterProjectRows(rows, new Set(["Go"])).map((row) => row.title)).toEqual(["First"]);
    });
});

describe("work domain", () => {
    it("builds featured work cards from records", () => {
        const cards = listFeaturedWorkCards(
            {
                version: "1.0.0",
                data: [
                    {
                        uuid: "work",
                        company: "Acme",
                        employment_type: "Full-Time",
                        location_type: "Remote",
                        position: "Engineer",
                        start_date: "2020",
                        end_date: "2024",
                        summary: "<p>Built systems.</p>",
                        country: "US",
                        city: "New York",
                        skills: "Go, TypeScript",
                    },
                ],
            },
            1,
        );

        expect(cards[0]?.title).toBe("Engineer · Acme");
        expect(cards[0]?.tags[0]).toEqual({ label: "Full-Time", color: "blue" });
    });
});

describe("skills domain", () => {
    it("groups signature skills and derives stable display helpers", () => {
        const fixture = {
            version: "1.0.0",
            data: {
                nickname: "gc",
                handle: "gocanto",
                name: "Gocanto",
                email: "hello@example.com",
                profession: "Engineer",
                skills: [
                    {
                        uuid: "skill",
                        percentage: 90,
                        item: "System Design",
                        description: "Architecture",
                        signature: true,
                    },
                ],
            },
        } as const;

        expect(listSignatureSkillCells(fixture)[0]?.iconKey).toBe("layers");
        expect(skillInitials("Go (Programming Language)")).toBe("GP");
        expect(["green", "blue", "purple", "amber"]).toContain(skillChipVariant("Kafka"));
    });
});

describe("recommendation domain", () => {
    it("dedupes, sorts, and maps testimonials", () => {
        expect(
            uniqueRecommendations([recommendationFixture.data[0], recommendationFixture.data[0]]),
        ).toHaveLength(1);
        expect(listRecommendationsNewestFirst(recommendationFixture)[0]?.uuid).toBe("new");
        expect(listTestimonials(recommendationFixture)[0]?.avatar).toBe(
            "https://oullin.io/images/new.jpg",
        );
    });
});

describe("search and detail domains", () => {
    it("builds search corpus entries and detail headers", () => {
        const corpus = buildSearchCorpus({
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
        expect(detailHeaderFor(corpus.projects[0]?.payload ?? null)?.title).toBe("Second");
    });
});
