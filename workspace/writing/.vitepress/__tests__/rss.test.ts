import { describe, expect, it } from "vitest";

import type { Post } from "#writing/posts-data";
import { renderRssFeed } from "#writing/rss";

function makePost(
    overrides: Omit<Partial<Post>, "date"> & { title: string; date: string; url: string },
): Post {
    const { title, date, url, ...rest } = overrides;

    return {
        title,
        url,
        date: {
            raw: date,
            display: date,
            short: date,
            year: date.slice(0, 4),
        },
        readingTime: "1 min",
        description: "A post description.",
        tags: [],
        ...rest,
    };
}

describe("renderRssFeed", () => {
    it("renders channel metadata and the canonical self link", () => {
        const rss = renderRssFeed([]);

        expect(rss).toContain("<title>Gustavo Ocanto — Writing</title>");
        expect(rss).toContain("<link>https://writing.gocanto.sh/</link>");
        expect(rss).toContain(
            '<atom:link href="https://writing.gocanto.sh/feed.rss" rel="self" type="application/rss+xml" />',
        );
        expect(rss).toContain("<language>en-US</language>");
    });

    it("orders posts newest first and uses stable canonical GUIDs", () => {
        const rss = renderRssFeed([
            makePost({ title: "Older", date: "2025-01-01", url: "/older" }),
            makePost({ title: "Newer", date: "2026-07-18", url: "/newer" }),
        ]);

        expect(rss.indexOf("<title>Newer</title>")).toBeLessThan(
            rss.indexOf("<title>Older</title>"),
        );
        expect(rss).toContain('<guid isPermaLink="true">https://writing.gocanto.sh/newer</guid>');
        expect(rss).toContain("<lastBuildDate>Sat, 18 Jul 2026 00:00:00 GMT</lastBuildDate>");
        expect(rss).toContain("<pubDate>Wed, 01 Jan 2025 00:00:00 GMT</pubDate>");
    });

    it("escapes XML text and preserves descriptions with CDATA boundaries", () => {
        const rss = renderRssFeed([
            makePost({
                title: `Shipping & scaling <safely> "today"`,
                date: "2026-07-18",
                url: "/shipping?mode=fast&safe=true",
                description: "Before ]]> after & <intact>",
                tags: ["go & edge", "<security>"],
            }),
        ]);

        expect(rss).toContain(
            "<title>Shipping &amp; scaling &lt;safely&gt; &quot;today&quot;</title>",
        );
        expect(rss).toContain("https://writing.gocanto.sh/shipping?mode=fast&amp;safe=true");
        expect(rss).toContain(
            "<description><![CDATA[Before ]]]]><![CDATA[> after & <intact>]]></description>",
        );
        expect(rss).toContain("<category>go &amp; edge</category>");
        expect(rss).toContain("<category>&lt;security&gt;</category>");
    });

    it("is deterministic and omits post-specific fields for an empty collection", () => {
        const posts = [makePost({ title: "One", date: "2026-07-18", url: "/one" })];

        expect(renderRssFeed(posts)).toBe(renderRssFeed(posts));
        expect(renderRssFeed([])).not.toContain("<lastBuildDate>");
        expect(renderRssFeed([])).not.toContain("<item>");
    });
});
