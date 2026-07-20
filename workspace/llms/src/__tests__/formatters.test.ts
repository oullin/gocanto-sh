import { describe, expect, it } from "vitest";

import type {
    BioFixture,
    EducationFixture,
    ExperienceFixture,
    LinksFixture,
    ProfileFixture,
    ProjectsFixture,
    RecommendationsFixture,
    TalksFixture,
} from "@gocanto/store";

import {
    formatAll,
    formatEducation,
    formatExperience,
    formatLinks,
    formatProfile,
    formatProjects,
    formatRecommendations,
    formatTalks,
} from "#llms/formatters";

const bio: BioFixture = {
    version: "1.0.0",
    data: {
        tagline: "A test biography.",
        note: "Fixture note.",
        paragraphs: ["<p>Fixture story.</p>"],
        quick_facts: [{ key: "Based in", value: "Test City" }],
    },
};

const profile: ProfileFixture = {
    version: "1.0.0",
    data: {
        nickname: "gus",
        handle: "gocanto",
        name: "Gustavo Ocanto",
        email: "gus@example.com",
        profession: "Software Architect",
        skills: [
            {
                uuid: "11111111-1111-1111-1111-111111111111",
                percentage: 95,
                item: "Leadership",
                description: "<p>Engineering leadership at scale.</p>",
                signature: true,
                years: 10,
                related_tech: ["OKRs", "RFCs"],
                example_projects: [
                    "Plain string project",
                    { title: "Linked project", url: "https://example.com/p" },
                    { title: "Untitled URL" },
                ],
            },
            {
                uuid: "22222222-2222-2222-2222-222222222222",
                percentage: 80,
                item: "Go",
                description: "Backend in Go.",
            },
        ],
    },
};

const projects: ProjectsFixture = {
    version: "1.0.0",
    data: [
        {
            uuid: "p2",
            language: "Go",
            title: "Second",
            excerpt: "Second project.",
            url: "https://example.com/2",
            is_open_source: true,
            icon: "Server",
            published_at: "2025-10-18",
            sort: 2,
        },
        {
            uuid: "p1",
            language: "Vue",
            title: "First",
            excerpt: "First project.",
            url: "https://example.com/1",
            is_open_source: false,
            icon: "Globe",
            published_at: "2025-09-01",
            sort: 1,
        },
    ],
};

const recommendations: RecommendationsFixture = {
    version: "1.0.0",
    data: [
        {
            uuid: "r1",
            relation: "Reported | directly",
            text: "Great <em>engineer</em>.<br/>Strong.",
            person: {
                avatar: "x.jpg",
                full_name: "Alice",
                company: "Co",
                designation: "Eng",
            },
            created_at: "2025-01-01",
            updated_at: "2025-01-02",
            featured: 0,
        },
    ],
};

const experience: ExperienceFixture = {
    version: "1.0.0",
    data: [
        {
            uuid: "e1",
            company: "ACME",
            employment_type: "Full-time",
            location_type: "Remote",
            position: "Staff Engineer",
            start_date: "2020",
            end_date: "2024",
            summary: "<p>Did things.</p>",
            country: "SG",
            city: "Singapore",
            skills: "Go, TS",
        },
    ],
};

const education: EducationFixture = {
    version: "1.0.0",
    data: [
        {
            uuid: "ed1",
            icon: "uni.png",
            school: "Some Uni",
            degree: "BSc",
            field: "CS",
            description: "<p>Studied.</p>",
            graduated_at: "2012",
            issuing_country: "Venezuela",
        },
    ],
};

const talks: TalksFixture = {
    version: "1.0.0",
    data: [
        {
            uuid: "t1",
            subject: "Subject",
            title: "Title",
            url: "https://example.com/t",
            photo: "p.jpg",
            location: "Singapore",
            created_at: "2025-05-01",
            updated_at: "2025-05-02",
        },
    ],
};

const links: LinksFixture = {
    version: "1.0.0",
    data: [
        {
            uuid: "l1",
            handle: "@gocanto",
            url: "https://example.com/gh",
            description: "<p>Code &amp; PRs.</p>",
            name: "GitHub",
        },
    ],
};

describe("formatProfile", () => {
    const out = formatProfile(profile);

    it("renders the name as an H1", () => {
        expect(out.startsWith("# Gustavo Ocanto\n")).toBe(true);
    });

    it("marks signature skills", () => {
        expect(out).toContain("### Leadership ⭐ (signature)");
        expect(out).toContain("### Go");
    });

    it("includes the email", () => {
        expect(out).toContain("**Email:** gus@example.com");
    });

    it("strips HTML from skill descriptions", () => {
        expect(out).toContain("Engineering leadership at scale.");
        expect(out).not.toMatch(/<p>|<\/p>/);
    });

    it("renders related tech and example projects", () => {
        expect(out).toContain("**Related:** OKRs, RFCs");
        expect(out).toContain("- Plain string project");
        expect(out).toContain("- [Linked project](https://example.com/p)");
        expect(out).toContain("- Untitled URL");
    });
});

describe("formatProjects", () => {
    it("sorts ascending by sort and produces no HTML in excerpts", () => {
        const out = formatProjects(projects);
        const firstIdx = out.indexOf("### First");
        const secondIdx = out.indexOf("### Second");

        expect(firstIdx).toBeGreaterThan(-1);
        expect(secondIdx).toBeGreaterThan(firstIdx);
        expect(out).not.toMatch(/<[a-z]+>/i);
    });
});

describe("formatExperience", () => {
    it("strips HTML from summary", () => {
        const out = formatExperience(experience);

        expect(out).toContain("### Staff Engineer — ACME");
        expect(out).toContain("Did things.");
        expect(out).not.toMatch(/<[a-z]+>/i);
    });
});

describe("formatEducation", () => {
    it("renders heading", () => {
        const out = formatEducation(education);

        expect(out).toContain("### BSc, CS");
        expect(out).not.toMatch(/<[a-z]+>/i);
    });
});

describe("formatRecommendations", () => {
    const out = formatRecommendations(recommendations);

    it("escapes `|` in the relation line", () => {
        expect(out).toContain("_Reported \\| directly_");
    });

    it("quotes the body and strips HTML", () => {
        expect(out).toMatch(/^> Great engineer\./m);
        expect(out).not.toMatch(/<em>|<\/em>|<br/i);
    });
});

describe("formatTalks", () => {
    it("renders heading and URL", () => {
        const out = formatTalks(talks);

        expect(out).toContain("### Title");
        expect(out).toContain("<https://example.com/t>");
    });
});

describe("formatLinks", () => {
    it("decodes HTML entities in description", () => {
        const out = formatLinks(links);

        expect(out).toContain("[GitHub (@gocanto)](https://example.com/gh)");
        expect(out).toContain("Code & PRs.");
        expect(out).not.toMatch(/&amp;/);
    });
});

describe("formatAll", () => {
    it("joins sections with --- separators", () => {
        const out = formatAll({
            profile,
            bio,
            projects,
            experience,
            education,
            recommendations,
            talks,
            links,
        });

        const separators = out.match(/\n\n---\n\n/g) ?? [];
        // 7 separators between the 8 top-level sections, plus one inside the
        // projects section because the fixture has two projects.
        expect(separators.length).toBe(8);
        expect(out).toContain("# Gustavo Ocanto");
        expect(out).toContain("# Bio");
        expect(out).toContain("# Projects");
        expect(out).toContain("# Experience");
        expect(out).toContain("# Education");
        expect(out).toContain("# Talks");
        expect(out).toContain("# Recommendations");
        expect(out).toContain("# Links");
    });
});
