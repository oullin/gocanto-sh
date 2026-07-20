import { describe, expect, it } from "vitest";

import { bio } from "@gocanto/store";

import { BioFormatter } from "#llms/bio-formatter";

describe("BioFormatter", () => {
    const output = new BioFormatter(bio).format();

    it("renders the tagline as a blockquote", () => {
        expect(output).toContain(`> ${bio.data.tagline}`);
    });

    it("preserves paragraph text without raw HTML", () => {
        expect(output).toContain("I write software that handles real money and real customers.");
        expect(output).not.toContain("<");
    });

    it("renders every quick-fact key", () => {
        for (const { key } of bio.data.quick_facts) {
            expect(output).toContain(`- **${key}:**`);
        }
    });

    it("includes the Open to line", () => {
        expect(output).toContain(
            "- **Open to:** Fractional CTO · Architecture reviews · Select full-time",
        );
    });
});
