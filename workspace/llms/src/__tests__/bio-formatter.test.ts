import { describe, expect, it } from "vitest";

import { stripHtml } from "@gocanto/domain/text";
import { bio } from "@gocanto/store";

import { BioFormatter } from "#llms/bio-formatter";

describe("BioFormatter", () => {
    const output = new BioFormatter(bio).format();

    it("renders the tagline as a blockquote", () => {
        expect(output).toContain(`> ${bio.data.tagline}`);
    });

    it("preserves paragraph text without raw HTML", () => {
        expect(output).toContain(stripHtml(bio.data.paragraphs[0]));
        expect(output).not.toContain("<");
    });

    it("renders every quick fact", () => {
        for (const { key, value } of bio.data.quick_facts) {
            expect(output).toContain(`- **${key}:** ${value}`);
        }
    });
});
