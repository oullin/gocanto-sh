import { describe, expect, it } from "vitest";

import type { Post } from "#writing/posts-data";
import {
    countLabel,
    filterPosts,
    groupByYear,
    matchesQuery,
    topTags,
} from "#writing/theme/search";

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

describe("matchesQuery", () => {
    it("matches on title, description or tags, case-insensitively", () => {
        expect(matchesQuery(posts[0], "WEBHOOK")).toBe(true); // title
        expect(matchesQuery(posts[0], "idempotency")).toBe(true); // description
        expect(matchesQuery(posts[0], "security")).toBe(true); // tag
    });

    it("returns true for an empty/whitespace query", () => {
        expect(matchesQuery(posts[0], "")).toBe(true);
        expect(matchesQuery(posts[0], "   ")).toBe(true);
    });

    it("returns false when nothing matches", () => {
        expect(matchesQuery(posts[0], "kafka")).toBe(false);
    });
});

describe("filterPosts", () => {
    it("returns everything for tag 'all' and no query", () => {
        expect(filterPosts(posts, "", "all")).toHaveLength(3);
    });

    it("filters by tag", () => {
        expect(filterPosts(posts, "", "cloudflare").map((p) => p.title)).toEqual(["Edge caching"]);
    });

    it("combines tag and query (AND)", () => {
        // tag=go narrows to all three; query 'edge' narrows to one
        expect(filterPosts(posts, "edge", "go").map((p) => p.title)).toEqual(["Edge caching"]);
    });

    it("returns empty when the combination matches nothing", () => {
        expect(filterPosts(posts, "webhook", "postgres")).toEqual([]);
    });
});

describe("topTags", () => {
    it("puts 'all' first, then tags ordered by frequency", () => {
        // go appears 3x, so it must lead the real tags after 'all'
        expect(topTags(posts)[0]).toBe("all");
        expect(topTags(posts)[1]).toBe("go");
    });

    it("respects the limit (excluding the leading 'all')", () => {
        expect(topTags(posts, 2)).toHaveLength(3); // 'all' + 2 tags
    });
});

describe("countLabel", () => {
    it("pluralizes", () => {
        expect(countLabel(1)).toBe("1 post");
        expect(countLabel(0)).toBe("0 posts");
        expect(countLabel(3)).toBe("3 posts");
    });
});

describe("groupByYear", () => {
    it("groups posts by year with a plural-aware count", () => {
        const groups = groupByYear(posts);

        expect(groups.map((g) => g.year)).toEqual(["2026", "2025"]);
        expect(groups[0].count).toBe("2 posts");
        expect(groups[1].count).toBe("1 post");
    });

    it("drops the featured post so it isn't listed twice", () => {
        const groups = groupByYear(posts, posts[0]);
        const titles = groups.flatMap((g) => g.items.map((p) => p.title));

        expect(titles).not.toContain("Signed webhooks");
        expect(titles).toHaveLength(2);
    });

    it("still lists the featured post when it is the only one", () => {
        const only = [posts[0]];
        const groups = groupByYear(only, posts[0]);

        expect(groups.flatMap((g) => g.items.map((p) => p.title))).toEqual(["Signed webhooks"]);
    });
});
