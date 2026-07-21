import { describe, expect, it } from "vitest";

import type { Post } from "#writing/posts";
import { WritingIndexSearch } from "#writing/search";

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
    makePost(
        {
            title: "Signed webhooks",
            year: "2026",
            tags: ["webhooks", "security", "go"],
            description: "HMAC and idempotency",
        },
    ),
    makePost(
        {
            title: "Edge caching",
            year: "2026",
            tags: ["cloudflare", "go"],
            description: "Workers at the edge",
        },
    ),
    makePost(
        {
            title: "Outbox pattern",
            year: "2025",
            tags: ["postgres", "go"],
            description: "transactional outbox",
        },
    ),
];

describe("WritingIndexSearch.matchesQuery", () => {
    it("matches on title, description or tags, case-insensitively", () => {
        expect(
            WritingIndexSearch.matchesQuery(posts[0], "WEBHOOK"),
        ).toBe(true); // title
        expect(
            WritingIndexSearch.matchesQuery(posts[0], "idempotency"),
        ).toBe(true); // description
        expect(
            WritingIndexSearch.matchesQuery(posts[0], "security"),
        ).toBe(true); // tag
    });

    it("returns true for an empty/whitespace query", () => {
        expect(
            WritingIndexSearch.matchesQuery(posts[0], ""),
        ).toBe(true);
        expect(
            WritingIndexSearch.matchesQuery(posts[0], "   "),
        ).toBe(true);
    });

    it("returns false when nothing matches", () => {
        expect(
            WritingIndexSearch.matchesQuery(posts[0], "kafka"),
        ).toBe(false);
    });
});

describe("WritingIndexSearch.filterPosts", () => {
    it("returns everything for tag 'all' and no query", () => {
        expect(
            WritingIndexSearch.filterPosts(posts, "", WritingIndexSearch.allTopics),
        ).toHaveLength(3);
    });

    it("filters by tag", () => {
        const cloudflare = WritingIndexSearch.topicTag("cloudflare");

        expect(
            WritingIndexSearch.filterPosts(posts, "", cloudflare).map((p) => p.title),
        ).toEqual([
            "Edge caching",
        ]);
    });

    it("combines tag and query (AND)", () => {
        // tag=go narrows to all three; query 'edge' narrows to one
        const go = WritingIndexSearch.topicTag("go");

        expect(
            WritingIndexSearch.filterPosts(posts, "edge", go).map((p) => p.title),
        ).toEqual([
            "Edge caching",
        ]);
    });

    it("returns empty when the combination matches nothing", () => {
        const postgres = WritingIndexSearch.topicTag("postgres");

        expect(
            WritingIndexSearch.filterPosts(posts, "webhook", postgres),
        ).toEqual([]);
    });
});

describe("WritingIndexSearch.tagCounts", () => {
    it("orders every tag by count descending", () => {
        expect(WritingIndexSearch.tagCounts(posts)[0]).toEqual({ tag: "go", count: 3 });
        expect(
            WritingIndexSearch.tagCounts(posts),
        ).toHaveLength(5);
    });

    it("orders equal counts alphabetically", () => {
        expect(
            WritingIndexSearch.tagCounts(posts)
                .slice(1)
                .map(({ tag }) => tag),
        ).toEqual(["cloudflare", "postgres", "security", "webhooks"]);
    });

    it("counts a repeated tag only once per post", () => {
        const postWithDuplicateTags = makePost(
            {
                title: "Duplicate metadata",
                year: "2026",
                tags: ["go", "go", "security"],
            },
        );

        expect(
            WritingIndexSearch.tagCounts([postWithDuplicateTags]),
        ).toEqual([
            { tag: "go", count: 1 },
            { tag: "security", count: 1 },
        ]);
    });
});

describe("WritingIndexSearch.topTopics", () => {
    it("caps the rail at the most-used topics", () => {
        expect(
            WritingIndexSearch.topTopics(posts, 2).map(({ tag }) => tag),
        ).toEqual([
            "go",
            "cloudflare",
        ]);
    });

    it("returns every topic when there are fewer than the limit", () => {
        expect(
            WritingIndexSearch.topTopics(posts),
        ).toHaveLength(5);
    });
});

describe("WritingIndexSearch.isFiltering", () => {
    it("is false only on the unfiltered default view", () => {
        expect(
            WritingIndexSearch.isFiltering("", WritingIndexSearch.allTopics),
        ).toBe(false);
        expect(
            WritingIndexSearch.isFiltering("   ", WritingIndexSearch.allTopics),
        ).toBe(false);
    });

    it("is true for a query or a topic", () => {
        expect(
            WritingIndexSearch.isFiltering("kafka", WritingIndexSearch.allTopics),
        ).toBe(true);
        expect(
            WritingIndexSearch.isFiltering("", WritingIndexSearch.topicTag("go")),
        ).toBe(true);
    });
});

describe("WritingIndexSearch.countLabel", () => {
    it("pluralizes", () => {
        expect(
            WritingIndexSearch.countLabel(1),
        ).toBe("1 post");
        expect(
            WritingIndexSearch.countLabel(0),
        ).toBe("0 posts");
        expect(
            WritingIndexSearch.countLabel(3),
        ).toBe("3 posts");
    });

    it("reports the matched subset while filtering", () => {
        expect(
            WritingIndexSearch.countLabel(3, 1),
        ).toBe("1 of 3 posts");
        expect(
            WritingIndexSearch.countLabel(3, 0),
        ).toBe("0 of 3 posts");
    });
});

describe("WritingIndexSearch.yearRange", () => {
    it("spans oldest to newest", () => {
        expect(
            WritingIndexSearch.yearRange(posts),
        ).toBe("2025–2026");
    });

    it("collapses a single year", () => {
        expect(
            WritingIndexSearch.yearRange([posts[0], posts[1]]),
        ).toBe("2026");
    });

    it("falls back to the current year with no posts", () => {
        expect(
            WritingIndexSearch.yearRange([]),
        ).toBe(String(new Date().getFullYear()));
    });
});

describe("WritingIndexSearch.archivePosts", () => {
    it("drops the featured post so it isn't listed twice", () => {
        const titles = WritingIndexSearch.archivePosts(posts, posts[0]).map((p) => p.title);

        expect(titles).not.toContain("Signed webhooks");
        expect(titles).toHaveLength(2);
    });

    it("leaves the archive empty when the featured post is the only one", () => {
        expect(
            WritingIndexSearch.archivePosts([posts[0]], posts[0]),
        ).toEqual([]);
    });

    it("lists every match while filtering, featured included", () => {
        const webhooks = WritingIndexSearch.topicTag("webhooks");
        const matches = WritingIndexSearch.filterPosts(posts, "", webhooks);

        expect(
            WritingIndexSearch.archivePosts(matches, posts[0], true).map((p) => p.title),
        ).toEqual(["Signed webhooks"]);
    });
});
