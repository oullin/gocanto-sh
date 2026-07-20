import { describe, expect, it } from "vitest";

declare global {
    // `var` is required by TypeScript's ambient global-variable syntax. Kept
    // identical to the declaration in `rss-serve.test.ts` — TypeScript
    // requires ambient global declarations to match across files.
    var VITEPRESS_CONFIG:
        | {
              srcDir: string;
              site: { base: string };
              cleanUrls: boolean;
          }
        | undefined;
}

// `posts.data.ts`'s default export calls VitePress's `createContentLoader`
// at module-evaluation time, and that call throws unless `global.VITEPRESS_CONFIG`
// has already been set by an active VitePress process. This suite only
// exercises the pure helper functions below (not the content loader itself),
// so we seed the minimal config the framework checks for — real framework
// state, not a module mock — and import the module dynamically afterward so
// the seed runs before evaluation (a static import would be hoisted ahead of it).
globalThis.VITEPRESS_CONFIG = {
    srcDir: process.cwd(),
    site: { base: "/" },
    cleanUrls: true,
};

const { formatDate, normalizeDate, normalizeTags, readingTime } = await import("../../posts.data");

const URL = "/some-post";

describe("formatDate", () => {
    it("formats a valid YYYY-MM-DD date", () => {
        expect(formatDate("2026-07-18", URL)).toEqual({
            raw: "2026-07-18",
            display: "Jul 18, 2026",
            short: "Jul 18",
            year: "2026",
        });
    });

    it("throws on a round-trip mismatch (e.g. 2026-02-30 normalizes to Mar 2)", () => {
        expect(() => formatDate("2026-02-30", URL)).toThrow(
            'Invalid date "2026-02-30" in post /some-post. Expected YYYY-MM-DD format.',
        );
    });

    it("throws on an unparseable date", () => {
        expect(() => formatDate("garbage", URL)).toThrow(
            'Invalid date "garbage" in post /some-post. Expected YYYY-MM-DD format.',
        );
    });
});

describe("normalizeDate", () => {
    it("throws for an invalid Date instance", () => {
        expect(() => normalizeDate(new Date("invalid"), URL)).toThrow(
            "Invalid date in post /some-post. Expected YYYY-MM-DD format.",
        );
    });

    it("returns the same string for a string input", () => {
        expect(normalizeDate("2026-07-18", URL)).toBe("2026-07-18");
    });

    it("returns null for a non-string, non-Date value", () => {
        expect(normalizeDate(42, URL)).toBeNull();
    });
});

describe("readingTime", () => {
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

        expect(readingTime(src)).toBe("2 min");
    });

    it("returns '1 min' for short text", () => {
        expect(readingTime("just a few words here")).toBe("1 min");
    });
});

describe("normalizeTags", () => {
    it("filters an array down to strings only", () => {
        expect(normalizeTags(["a", 1, "b"])).toEqual(["a", "b"]);
    });

    it("wraps a lone string in an array", () => {
        expect(normalizeTags("solo")).toEqual(["solo"]);
    });

    it("returns an empty array for anything else", () => {
        expect(normalizeTags(undefined)).toEqual([]);
    });
});
