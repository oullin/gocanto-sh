import { describe, expect, it } from "vitest";

import { bio } from "../bio";
import { education } from "../education";
import { experience } from "../experience";
import { links } from "../links";
import { profile } from "../profile";
import { projects } from "../projects";
import { recommendations } from "../recommendations";
import { talks } from "../talks";
import type { ProfileSkillRecord } from "../types";

type WithUuid = { readonly uuid: string };

const assertUniqueUuids = (records: readonly WithUuid[], label: string) => {
    const seen = new Set<string>();

    for (const record of records) {
        expect(record.uuid, `${label} record missing uuid`).toBeTruthy();
        expect(seen.has(record.uuid), `duplicate uuid in ${label}: ${record.uuid}`).toBe(false);
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
    it("sort indices are unique", () => {
        const sorts = projects.data.map((p) => p.sort);

        expect(new Set(sorts).size).toBe(sorts.length);
    });
});

describe("profile", () => {
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
