import { writeFile } from "node:fs/promises";
import type { IncomingMessage, ServerResponse } from "node:http";
import { join } from "node:path";

import type { Post } from "#writing/posts";

const SITE_URL = "https://writing.gocanto.sh";
const FEED_TITLE = "Gustavo Ocanto — Writing";
const FEED_DESCRIPTION =
    "Engineering notes by Gustavo Ocanto — Go, Laravel, and the edge. Real code from shipped systems, not slop.";

interface RssChannel {
    title: string;
    description: string;
    link: string;
    feedUrl: string;
    language: string;
    copyright: string;
}

interface RssItem {
    title: string;
    link: string;
    guid: string;
    publishedAt: Date;
    description: string;
    categories: string[];
}

/** Dependencies injected into a feed instance. */
interface RssFeedDeps {
    /** Loads the posts to render into the feed. */
    loadPosts: () => Promise<Post[]>;
}

/** Loads, renders, serves, and writes the writing RSS feed. */
export class RssFeed {
    /** The public path of the RSS feed. */
    public static readonly PATH = "/feed.rss";

    /** The response content type of the RSS feed. */
    public static readonly CONTENT_TYPE = "application/rss+xml; charset=utf-8";

    // Node loads this file with type-stripping (config bundle path), which
    // cannot erase TS parameter properties — assign the field explicitly.
    private readonly deps: RssFeedDeps;

    /**
     * Creates a feed instance around a posts source.
     *
     * @param deps - The injected posts loader.
     */
    public constructor(deps: RssFeedDeps) {
        this.deps = deps;
    }

    /** Renders posts as deterministic RSS XML. */
    public static render(posts: Post[]): string {
        const items = RssFeed.toRssItems(posts);
        const lastBuildDate = items[0]?.publishedAt;
        const lines = [
            '<?xml version="1.0" encoding="utf-8"?>',
            '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
            "  <channel>",
            `    <title>${RssFeed.escapeXml(channel.title)}</title>`,
            `    <link>${RssFeed.escapeXml(channel.link)}</link>`,
            `    <description>${RssFeed.escapeXml(channel.description)}</description>`,
            `    <language>${RssFeed.escapeXml(channel.language)}</language>`,
            `    <copyright>${RssFeed.escapeXml(channel.copyright)}</copyright>`,
            `    <atom:link href="${RssFeed.escapeXml(channel.feedUrl)}" rel="self" type="application/rss+xml" />`,
        ];

        if (lastBuildDate) {
            lines.push(`    <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>`);
        }

        for (const item of items) {
            lines.push(
                "    <item>",
                `      <title>${RssFeed.escapeXml(item.title)}</title>`,
                `      <link>${RssFeed.escapeXml(item.link)}</link>`,
                `      <guid isPermaLink="true">${RssFeed.escapeXml(item.guid)}</guid>`,
                `      <pubDate>${item.publishedAt.toUTCString()}</pubDate>`,
                `      <description>${RssFeed.asCdata(item.description)}</description>`,
            );

            for (const category of item.categories) {
                lines.push(`      <category>${RssFeed.escapeXml(category)}</category>`);
            }

            lines.push("    </item>");
        }

        lines.push("  </channel>", "</rss>", "");

        return lines.join("\n");
    }

    /** Loads posts and renders the RSS feed. */
    public async load(): Promise<string> {
        return RssFeed.render(await this.deps.loadPosts());
    }

    /** Serves an RSS GET or HEAD request when its path matches the feed. */
    public async serve(request: IncomingMessage, response: ServerResponse): Promise<boolean> {
        const pathname = new URL(request.url ?? "/", "http://localhost").pathname;

        if (pathname !== RssFeed.PATH || (request.method !== "GET" && request.method !== "HEAD")) {
            return false;
        }

        const rss = await this.load();

        response.statusCode = 200;
        response.setHeader("Content-Type", RssFeed.CONTENT_TYPE);
        response.setHeader("Cache-Control", "no-cache");
        response.end(request.method === "HEAD" ? undefined : rss);

        return true;
    }

    /** Writes the rendered RSS feed into a VitePress output directory. */
    public async write(outDir: string): Promise<void> {
        await writeFile(join(outDir, RssFeed.PATH.slice(1)), await this.load(), "utf8");
    }

    private static escapeXml(value: string): string {
        return value
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&apos;");
    }

    private static asCdata(value: string): string {
        return `<![CDATA[${value.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
    }

    private static parsePostDate(post: Post): Date {
        const date = new Date(`${post.date.raw}T00:00:00.000Z`);

        if (Number.isNaN(date.getTime())) {
            throw new Error(`Cannot generate RSS for ${post.url}: invalid date ${post.date.raw}`);
        }

        return date;
    }

    private static toRssItems(posts: Post[]): RssItem[] {
        return posts
            .map((post) => {
                const link = new URL(post.url, `${SITE_URL}/`).toString();

                return {
                    title: post.title,
                    link,
                    guid: link,
                    publishedAt: RssFeed.parsePostDate(post),
                    description: post.description,
                    categories: post.tags,
                };
            })
            .sort((left, right) => right.publishedAt.getTime() - left.publishedAt.getTime());
    }
}

const channel: RssChannel = {
    title: FEED_TITLE,
    description: FEED_DESCRIPTION,
    link: `${SITE_URL}/`,
    feedUrl: `${SITE_URL}${RssFeed.PATH}`,
    language: "en-US",
    copyright: "© Gustavo Ocanto",
};
