import { describe, expect, it } from "vitest";

import type { Post } from "../../../posts.data";
import { WritingIndexSearch } from "../search";

function makePost(overrides: Partial<Post> & { title: string; year: string }): Post {
    const { title, year, ...rest } = overrides;

    return {
        title,
        url: `/${title.toLowerCase().replace(/\s+/g, "-")}`,
        date: { raw: `${year}-01-01`, display: `Jan 1, ${year}`, short: "Jan 01", year },
        readingTime: "5 min",
        description: "",
        tags: [],
        ...rest,
    };
}

const posts: Post[] = [
    makePost({
        title: "Signed webhooks",
        year: "2026",
        tags: ["webhooks", "security", "go"],
        description: "HMAC and idempotency",
    }),
    makePost({
        title: "Edge caching",
        year: "2026",
        tags: ["cloudflare", "go"],
        description: "Workers at the edge",
    }),
    makePost({
        title: "Outbox pattern",
        year: "2025",
        tags: ["postgres", "go"],
        description: "transactional outbox",
    }),
];

describe("WritingIndexSearch.matchesQuery", () => {
    it("matches on title, description or tags, case-insensitively", () => {
        expect(WritingIndexSearch.matchesQuery(posts[0], "WEBHOOK")).toBe(true); // title
        expect(WritingIndexSearch.matchesQuery(posts[0], "idempotency")).toBe(true); // description
        expect(WritingIndexSearch.matchesQuery(posts[0], "security")).toBe(true); // tag
    });

    it("returns true for an empty/whitespace query", () => {
        expect(WritingIndexSearch.matchesQuery(posts[0], "")).toBe(true);
        expect(WritingIndexSearch.matchesQuery(posts[0], "   ")).toBe(true);
    });

    it("returns false when nothing matches", () => {
        expect(WritingIndexSearch.matchesQuery(posts[0], "kafka")).toBe(false);
    });
});

describe("WritingIndexSearch.filterPosts", () => {
    it("returns everything for tag 'all' and no query", () => {
        expect(WritingIndexSearch.filterPosts(posts, "", WritingIndexSearch.allTopics)).toHaveLength(
            3,
        );
    });

    it("filters by tag", () => {
        const cloudflare = WritingIndexSearch.topicTag("cloudflare");

        expect(WritingIndexSearch.filterPosts(posts, "", cloudflare).map((p) => p.title)).toEqual([
            "Edge caching",
        ]);
    });

    it("combines tag and query (AND)", () => {
        // tag=go narrows to all three; query 'edge' narrows to one
        const go = WritingIndexSearch.topicTag("go");

        expect(WritingIndexSearch.filterPosts(posts, "edge", go).map((p) => p.title)).toEqual([
            "Edge caching",
        ]);
    });

    it("returns empty when the combination matches nothing", () => {
        const postgres = WritingIndexSearch.topicTag("postgres");

        expect(WritingIndexSearch.filterPosts(posts, "webhook", postgres)).toEqual([]);
    });
});

describe("WritingIndexSearch.tagCounts", () => {
    it("orders every tag by count descending", () => {
        expect(WritingIndexSearch.tagCounts(posts)[0]).toEqual({ tag: "go", count: 3 });
        expect(WritingIndexSearch.tagCounts(posts)).toHaveLength(5);
    });

    it("orders equal counts alphabetically", () => {
        expect(WritingIndexSearch.tagCounts(posts).slice(1).map(({ tag }) => tag)).toEqual([
            "cloudflare",
            "postgres",
            "security",
            "webhooks",
        ]);
    });

    it("counts a repeated tag only once per post", () => {
        const postWithDuplicateTags = makePost({
            title: "Duplicate metadata",
            year: "2026",
            tags: ["go", "go", "security"],
        });

        expect(WritingIndexSearch.tagCounts([postWithDuplicateTags])).toEqual([
            { tag: "go", count: 1 },
            { tag: "security", count: 1 },
        ]);
    });
});

describe("WritingIndexSearch.countLabel", () => {
    it("pluralizes", () => {
        expect(WritingIndexSearch.countLabel(1)).toBe("1 post");
        expect(WritingIndexSearch.countLabel(0)).toBe("0 posts");
        expect(WritingIndexSearch.countLabel(3)).toBe("3 posts");
    });
});

describe("WritingIndexSearch.listPosts", () => {
    it("drops the featured post so it isn't listed twice", () => {
        const titles = WritingIndexSearch.listPosts(posts, posts[0]).map((p) => p.title);

        expect(titles).not.toContain("Signed webhooks");
        expect(titles).toHaveLength(2);
    });

    it("still lists the featured post when it is the only one", () => {
        const only = [posts[0]];

        expect(WritingIndexSearch.listPosts(only, posts[0]).map((p) => p.title)).toEqual([
            "Signed webhooks",
        ]);
    });

    it("preserves tag-filtered matches and applies the featured fallback", () => {
        const cloudflare = WritingIndexSearch.topicTag("cloudflare");
        const webhooks = WritingIndexSearch.topicTag("webhooks");
        const nonFeatured = WritingIndexSearch.filterPosts(posts, "", cloudflare);
        const featuredOnly = WritingIndexSearch.filterPosts(posts, "", webhooks);

        expect(WritingIndexSearch.listPosts(nonFeatured, posts[0]).map((p) => p.title)).toEqual([
            "Edge caching",
        ]);
        expect(WritingIndexSearch.listPosts(featuredOnly, posts[0]).map((p) => p.title)).toEqual([
            "Signed webhooks",
        ]);
    });
});
