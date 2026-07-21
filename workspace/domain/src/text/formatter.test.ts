import { describe, expect, it } from "vitest";

import { TextFormatter } from "#domain/text/formatter";

describe("text helpers", () => {
    it("strips HTML entities and tags", () => {
        expect(
            TextFormatter.stripHtml("<p>Go &amp; TS<br>Done</p>"),
        ).toBe("Go & TS\nDone");
    });

    it("removes unsafe markup while preserving safe text", () => {
        expect(
            TextFormatter.stripHtml('<img src=x onerror="alert(1)">Safe<script>alert(1)</script>'),
        ).toBe("Safe");
    });

    it("handles nullish input as empty text", () => {
        expect(
            TextFormatter.stripHtml(null),
        ).toBe("");
        expect(
            TextFormatter.stripHtml(undefined),
        ).toBe("");
    });

    it("keeps text helper behavior on sanitized input", () => {
        expect(
            TextFormatter.excerpt("<p>First &amp; second sentence.</p>", 8),
        ).toBe("First &…");
        expect(
            TextFormatter.firstSentence("<p>First sentence. Second sentence.</p>", 80),
        ).toBe(
            "First sentence.",
        );
    });

    it("keeps compact search variants for punctuation-heavy queries", () => {
        expect(
            TextFormatter.searchable("AS/400", "Node.js"),
        ).toContain("AS400Nodejs");
    });
});
