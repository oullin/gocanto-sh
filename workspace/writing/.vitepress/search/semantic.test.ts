import { describe, expect, it } from "vitest";

import type { Post } from "#writing/posts";
import { SemanticSearch } from "#writing/search";

function makePost(slug: string): Post {
    return {
        canonicalUrl: `https://writing.gocanto.sh/${slug}`,
        date: { display: "Jan 1, 2026", raw: "2026-01-01", short: "Jan 01", year: "2026" },
        description: `About ${slug}`,
        image: "https://writing.gocanto.sh/og-image.png",
        modifiedAt: "2026-01-01",
        readingTime: "5 min",
        tags: [],
        title: slug,
        url: `/${slug}`,
    };
}

const posts = ["a", "b", "c", "d"].map(makePost);

describe("SemanticSearch.hits", () => {
    it("keeps well-formed hits and rejects anything that is not an array", () => {
        expect(
            SemanticSearch.hits([
                { score: 0.9, title: "A", url: "/a" },
                { title: "B", url: "/b" },
                null,
            ]),
        ).toEqual([{ score: 0.9, title: "A", url: "/a" }]);
        expect(
            SemanticSearch.hits({ error: "down" }),
        ).toBeNull();
    });
});

describe("SemanticSearch.related", () => {
    it("drops the current post and unknown urls, then caps the list", () => {
        const hits = ["/a", "/gone", "/c", "/b", "/d"].map((url) => ({
            score: 1,
            title: url,
            url,
        }));

        expect(
            SemanticSearch.related(hits, posts, "/a", 2).map((p) => p.url),
        ).toEqual([
            "/c",
            "/b",
        ]);
    });

    it("builds the query from the title and description", () => {
        expect(
            SemanticSearch.relatedQuery(posts[0]),
        ).toBe("a. About a");
    });
});
