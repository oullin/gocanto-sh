import { describe, expect, it } from "vitest";

import type { ProfileFixture } from "@gocanto/store";

import { LlmsTxt } from "#llms/llms-txt/llms-txt";

const profile: ProfileFixture = {
    version: "1.0.0",
    data: {
        nickname: "gus",
        handle: "gocanto",
        name: "Gustavo Ocanto",
        email: "gus@example.com",
        profession: "Software Architect",
        skills: [],
    },
};

describe("LlmsTxt.render", () => {
    const out = LlmsTxt.render("https://gocanto.sh", profile);

    it("opens with the H1 for the profile name", () => {
        expect(
            out.startsWith("# Gustavo Ocanto\n"),
        ).toBe(true);
    });

    it("contains a profession blockquote", () => {
        expect(out).toContain("> Software Architect");
    });

    it("links the combined profile and each section", () => {
        const links = [
            "https://gocanto.sh/index.md",
            "https://gocanto.sh/profile.md",
            "https://gocanto.sh/bio.md",
            "https://gocanto.sh/experience.md",
            "https://gocanto.sh/projects.md",
            "https://gocanto.sh/education.md",
            "https://gocanto.sh/talks.md",
            "https://gocanto.sh/recommendations.md",
            "https://gocanto.sh/links.md",
        ];

        for (const link of links) {
            expect(out).toContain(`(${link})`);
        }
    });
});
