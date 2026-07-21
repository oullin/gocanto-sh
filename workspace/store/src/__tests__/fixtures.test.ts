import { describe, expect, it } from "vitest";

import { bio } from "#store/bio";
import { education } from "#store/education";
import { experience } from "#store/experience";
import { links } from "#store/links";
import { profile } from "#store/profile";
import { projects } from "#store/projects";
import { recommendations } from "#store/recommendations";
import { talks } from "#store/talks";
import type { ProfileSkillRecord } from "#store/types";

type WithUuid = { readonly uuid: string };

const assertUniqueUuids = (records: readonly WithUuid[], label: string) => {
    const seen = new Set<string>();

    for (const record of records) {
        expect(record.uuid, `${label} record missing uuid`).toBeTruthy();
        expect(
        	seen.has(record.uuid),
        	`duplicate uuid in ${label}: ${record.uuid}`,
        ).toBe(false);
        seen.add(record.uuid);
    }
};

const allFixtures = {
    bio,
    education,
    experience,
    links,
    profile,
    projects,
    recommendations,
    talks,
} as const;

describe("fixture envelopes", () => {
    for (const [name, fixture] of Object.entries(allFixtures)) {
        it(`${name} has a non-empty version and data`, () => {
            expect(fixture.version).toMatch(/^\d+\.\d+\.\d+$/);
            expect(fixture.data).toBeDefined();
        });
    }
});

describe("uuid uniqueness", () => {
    it("education uuids are unique", () => {
        assertUniqueUuids(education.data, "education");
    });

    it("experience uuids are unique", () => {
        assertUniqueUuids(experience.data, "experience");
    });

    it("links uuids are unique", () => {
        assertUniqueUuids(links.data, "links");
    });

    it("projects uuids are unique", () => {
        assertUniqueUuids(projects.data, "projects");
    });

    it("recommendations uuids are unique", () => {
        assertUniqueUuids(recommendations.data, "recommendations");
    });

    it("talks uuids are unique", () => {
        assertUniqueUuids(talks.data, "talks");
    });

    it("profile skill uuids are unique", () => {
        assertUniqueUuids(profile.data.skills, "profile.skills");
    });
});

describe("projects", () => {
    it("has at least one project", () => {
        expect(projects.data.length).toBeGreaterThan(0);
    });

    it("sort indices are unique and form a contiguous range starting at 1", () => {
        const sorts = projects.data.map((p) => p.sort).sort((a, b) => a - b);

        expect(new Set(sorts).size).toBe(sorts.length);
        expect(sorts).toEqual(Array.from({ length: sorts.length }, (_, i) => i + 1));
    });
});

describe("recommendations", () => {
    it("has at least one recommendation", () => {
        expect(recommendations.data.length).toBeGreaterThan(0);
    });
});

describe("profile", () => {
    it("has at least one skill", () => {
        expect(profile.data.skills.length).toBeGreaterThan(0);
    });

    it("has at least one signature skill", () => {
        const skills = profile.data.skills as readonly ProfileSkillRecord[];
        const signature = skills.filter((s) => s.signature);

        expect(signature.length).toBeGreaterThan(0);
    });

    it("has a valid email", () => {
        expect(profile.data.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
});

describe("bio", () => {
    it("paragraphs is non-empty", () => {
        expect(bio.data.paragraphs.length).toBeGreaterThan(0);
    });

    it("quick_facts keys are unique", () => {
        const keys = bio.data.quick_facts.map((f) => f.key);

        expect(new Set(keys).size).toBe(keys.length);
    });
});
