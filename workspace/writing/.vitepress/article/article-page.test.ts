import { describe, expect, it } from "vitest";

import { WritingArticlePage } from "#writing/article";
import type { Post } from "#writing/posts";

function makePost(title: string, url: string): Post {
    return {
        title,
        url,
        date: { raw: "2026-01-01", display: "Jan 1, 2026", short: "Jan 01", year: "2026" },
        readingTime: "5 min",
        description: "",
        tags: [],
    };
}

const posts: Post[] = [
    makePost("Signed webhooks", "/signed-webhooks"),
    makePost("Edge caching", "/edge-caching"),
    makePost("Outbox pattern", "/outbox-pattern"),
];

describe("WritingArticlePage.cleanPath", () => {
    it("strips the .html extension VitePress serves without cleanUrls", () => {
        expect(
            WritingArticlePage.cleanPath("/signed-webhooks.html"),
        ).toBe("/signed-webhooks");
    });

    it("reduces a directory index to its directory", () => {
        expect(
            WritingArticlePage.cleanPath("/index.html"),
        ).toBe("/");
    });

    it("leaves an already-clean path untouched", () => {
        expect(
            WritingArticlePage.cleanPath("/signed-webhooks"),
        ).toBe("/signed-webhooks");
    });
});

describe("WritingArticlePage.isIndex", () => {
    it("recognises the index in each form the router produces", () => {
        expect(
            WritingArticlePage.isIndex("/"),
        ).toBe(true);
        expect(
            WritingArticlePage.isIndex(""),
        ).toBe(true);
        expect(
            WritingArticlePage.isIndex("/index.html"),
        ).toBe(true);
    });

    it("treats a post route as an article", () => {
        expect(
            WritingArticlePage.isIndex("/signed-webhooks"),
        ).toBe(false);
        expect(
            WritingArticlePage.isIndex("/signed-webhooks.html"),
        ).toBe(false);
    });
});

describe("WritingArticlePage.currentPost", () => {
    it("resolves the post behind the route", () => {
        expect(WritingArticlePage.currentPost(posts, "/edge-caching")?.title).toBe("Edge caching");
    });

    it("matches through .html and trailing slashes", () => {
        expect(WritingArticlePage.currentPost(posts, "/edge-caching.html")?.title).toBe(
            "Edge caching",
        );
        expect(WritingArticlePage.currentPost(posts, "/edge-caching/")?.title).toBe("Edge caching");
    });

    it("returns nothing for a route with no matching post", () => {
        expect(
            WritingArticlePage.currentPost(posts, "/missing"),
        ).toBeUndefined();
    });
});

describe("WritingArticlePage.tags", () => {
    it("passes through frontmatter tags", () => {
        expect(
            WritingArticlePage.tags(["webhooks", "security"]),
        ).toEqual(["webhooks", "security"]);
    });

    it("falls back to an empty list when a page declares none", () => {
        expect(
            WritingArticlePage.tags(undefined),
        ).toEqual([]);
        expect(
            WritingArticlePage.tags("webhooks"),
        ).toEqual([]);
    });

    it("drops non-string entries rather than rendering them", () => {
        expect(
            WritingArticlePage.tags(["webhooks", 42, null]),
        ).toEqual(["webhooks"]);
    });
});

describe("WritingArticlePage.relatedPosts", () => {
    it("never suggests the post being read", () => {
        const related = WritingArticlePage.relatedPosts(posts, posts[0]);

        expect(
            related.map((post) => post.url),
        ).toEqual(["/edge-caching", "/outbox-pattern"]);
    });

    it("caps the list at the related limit", () => {
        expect(
            WritingArticlePage.relatedPosts(posts, undefined),
        ).toHaveLength(2);
    });

    it("returns what it has when the archive is short", () => {
        expect(
            WritingArticlePage.relatedPosts([posts[0]], posts[0]),
        ).toEqual([]);
    });
});

describe("WritingArticlePage.progress", () => {
    it("reports zero on a page that does not scroll", () => {
        expect(
            WritingArticlePage.progress(0, 800, 800),
        ).toBe("0%");
    });

    it("tracks the way down the article", () => {
        expect(
            WritingArticlePage.progress(0, 2000, 1000),
        ).toBe("0%");
        expect(
            WritingArticlePage.progress(500, 2000, 1000),
        ).toBe("50%");
        expect(
            WritingArticlePage.progress(1000, 2000, 1000),
        ).toBe("100%");
    });

    it("clamps rubber-band overscroll to the bar's range", () => {
        expect(
            WritingArticlePage.progress(1400, 2000, 1000),
        ).toBe("100%");
        expect(
            WritingArticlePage.progress(-120, 2000, 1000),
        ).toBe("0%");
    });
});

describe("WritingArticlePage.showBackToTop", () => {
    it("stays hidden until the reader is past the offset", () => {
        expect(
            WritingArticlePage.showBackToTop(0),
        ).toBe(false);
        expect(
            WritingArticlePage.showBackToTop(WritingArticlePage.backToTopOffset),
        ).toBe(false);
        expect(
            WritingArticlePage.showBackToTop(WritingArticlePage.backToTopOffset + 1),
        ).toBe(true);
    });
});

describe("WritingArticlePage.headingLabel", () => {
    it("strips the zero-width space markdown anchors inject", () => {
        expect(
            WritingArticlePage.headingLabel("Part 1: Sign the body​"),
        ).toBe(
            "Part 1: Sign the body",
        );
    });

    it("trims surrounding whitespace and tolerates empty headings", () => {
        expect(
            WritingArticlePage.headingLabel("  The mental model  "),
        ).toBe("The mental model");
        expect(
            WritingArticlePage.headingLabel(null),
        ).toBe("");
    });
});

describe("WritingArticlePage.activeHeading", () => {
    const offsets = (...tops: number[]) => tops.map((top, index) => ({ id: `h${index + 1}`, top }));

    it("holds the first heading while the reader is still above it", () => {
        expect(
            WritingArticlePage.activeHeading(offsets(600, 900, 1400)),
        ).toBe("h1");
    });

    it("advances to the last heading scrolled past", () => {
        expect(
            WritingArticlePage.activeHeading(offsets(-400, 40, 900)),
        ).toBe("h2");
        expect(
            WritingArticlePage.activeHeading(offsets(-900, -400, -20)),
        ).toBe("h3");
    });

    it("counts a heading sitting exactly on the offset as read", () => {
        expect(
            WritingArticlePage.activeHeading(offsets(-100, WritingArticlePage.headingOffset, 900)),
        ).toBe("h2");
    });

    it("has nothing to mark on an article without headings", () => {
        expect(
            WritingArticlePage.activeHeading([]),
        ).toBeNull();
    });
});
