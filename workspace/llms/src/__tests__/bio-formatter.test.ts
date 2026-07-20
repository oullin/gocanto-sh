import { describe, expect, it } from "vitest";

import { stripHtml } from "@gocanto/domain/text";
import type { BioFixture } from "@gocanto/store";

import { BioFormatter } from "#llms/bio-formatter";

describe("BioFormatter", () => {
    const fixture: BioFixture = {
        version: "1.0.0",
        data: {
            tagline: "Building dependable software.",
            note: "A short fixture note.",
            paragraphs: [
                "<em>Reliability matters.</em> Especially in production.",
                "Good systems make their tradeoffs clear.",
            ],
            quick_facts: [
                { key: "Based in", value: "Test City" },
                { key: "Focus", value: "Reliable systems" },
            ],
        },
    };
    const output = new BioFormatter(fixture).format();

    it("renders the fixture structure", () => {
        expect(output).toContain(`# Bio\n\n> ${fixture.data.tagline}`);
        expect(output).toContain(`\n\n${fixture.data.note}\n\n## Story\n\n`);
        expect(output).toContain("\n\n## Quick facts\n\n");
    });

    it("preserves paragraph text without raw HTML", () => {
        expect(output).toContain(stripHtml(fixture.data.paragraphs[0]));
        expect(output).toContain(stripHtml(fixture.data.paragraphs[1]));
        expect(output).not.toContain("<em>");
    });

    it("derives every quick fact from the fixture", () => {
        for (const { key, value } of fixture.data.quick_facts) {
            expect(output).toContain(`- **${key}:** ${value}`);
        }
    });
});
