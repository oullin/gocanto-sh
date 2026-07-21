import { describe, expect, it } from "vitest";

import { Posts } from "#writing/posts/posts";

const URL = "/some-post";

describe("Posts.formatDate", () => {
    it("formats a valid YYYY-MM-DD date", () => {
        expect(
        	Posts.formatDate("2026-07-18", URL),
        ).toEqual({
            raw: "2026-07-18",
            display: "Jul 18, 2026",
            short: "Jul 18",
            year: "2026",
        });
    });

    it("throws on a round-trip mismatch (e.g. 2026-02-30 normalizes to Mar 2)", () => {
        expect(() => Posts.formatDate("2026-02-30", URL)).toThrow(
            'Invalid date "2026-02-30" in post /some-post. Expected YYYY-MM-DD format.',
        );
    });

    it("throws on an unparseable date", () => {
        expect(() => Posts.formatDate("garbage", URL)).toThrow(
            'Invalid date "garbage" in post /some-post. Expected YYYY-MM-DD format.',
        );
    });
});

describe("Posts.normalizeDate", () => {
    it("throws for an invalid Date instance", () => {
        expect(() => Posts.normalizeDate(new Date("invalid"), URL)).toThrow(
            "Invalid date in post /some-post. Expected YYYY-MM-DD format.",
        );
    });

    it("returns the same string for a string input", () => {
        expect(
        	Posts.normalizeDate("2026-07-18", URL),
        ).toBe("2026-07-18");
    });

    it("returns null for a non-string, non-Date value", () => {
        expect(
        	Posts.normalizeDate(42, URL),
        ).toBeNull();
    });
});

describe("Posts.readingTime", () => {
    it("strips frontmatter and fenced code before counting words", () => {
        const src = [
            "---",
            "title: Test",
            "date: 2026-07-18",
            "---",
            "```ts",
            "const wordsThatShouldNotCount = 1;",
            "```",
            Array.from({ length: 400 }, () => "word").join(" "),
        ].join("\n");

        expect(
        	Posts.readingTime(src),
        ).toBe("2 min");
    });

    it("returns '1 min' for short text", () => {
        expect(
        	Posts.readingTime("just a few words here"),
        ).toBe("1 min");
    });
});

describe("Posts.normalizeTags", () => {
    it("filters an array down to strings only", () => {
        expect(
        	Posts.normalizeTags(["a", 1, "b"]),
        ).toEqual(["a", "b"]);
    });

    it("wraps a lone string in an array", () => {
        expect(
        	Posts.normalizeTags("solo"),
        ).toEqual(["solo"]);
    });

    it("returns an empty array for anything else", () => {
        expect(
        	Posts.normalizeTags(undefined),
        ).toEqual([]);
    });
});
