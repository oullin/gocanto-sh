import type { BioFixture } from "@gocanto/store";
import { stripHtml } from "@gocanto/domain/text";

/** Formats the biography fixture as machine-readable markdown. */
export class BioFormatter {
    constructor(private readonly fixture: BioFixture) {}

    /** Returns the biography markdown without trailing blank padding. */
    format(): string {
        const { tagline, note, paragraphs, quick_facts } = this.fixture.data;

        return [
            "# Bio",
            "",
            `> ${tagline}`,
            "",
            note,
            "",
            "## Story",
            "",
            paragraphs.map((paragraph) => stripHtml(paragraph)).join("\n\n"),
            "",
            "## Quick facts",
            "",
            quick_facts.map(({ key, value }) => `- **${key}:** ${value}`).join("\n"),
        ].join("\n");
    }
}
