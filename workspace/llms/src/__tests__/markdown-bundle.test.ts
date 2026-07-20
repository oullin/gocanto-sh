import { describe, expect, it } from "vitest";

import { bio, education, experience, links, profile, projects, talks } from "@gocanto/store";
import { recommendations } from "@gocanto/store/recommendations";

import { MarkdownBundle } from "#llms/markdown-bundle";

describe("MarkdownBundle", () => {
    it("returns the same unchanged file map on repeated calls", () => {
        const bundle = new MarkdownBundle({
            profile,
            bio,
            projects,
            experience,
            education,
            recommendations,
            talks,
            links,
        });
        const first = bundle.files();
        const contents = [...first];
        const second = bundle.files();

        expect(second).toBe(first);
        expect([...second]).toEqual(contents);
    });

    it("builds the complete newline-terminated bundle", () => {
        const files = new MarkdownBundle({
            profile,
            bio,
            projects,
            experience,
            education,
            recommendations,
            talks,
            links,
        }).files();

        expect(new Set(files.keys())).toEqual(
            new Set([
                "profile.md",
                "bio.md",
                "experience.md",
                "projects.md",
                "education.md",
                "talks.md",
                "recommendations.md",
                "links.md",
                "index.md",
                "llms.txt",
                "sitemap.xml",
            ]),
        );

        for (const contents of files.values()) {
            expect(contents.endsWith("\n")).toBe(true);
        }

        const index = files.get("index.md");
        const sectionHeadings = [
            `# ${profile.data.name}`,
            "# Bio",
            "# Experience",
            "# Projects",
            "# Education",
            "# Talks",
            "# Recommendations",
            "# Links",
        ];

        for (const heading of sectionHeadings) {
            expect(index).toContain(heading);
        }
    });
});
