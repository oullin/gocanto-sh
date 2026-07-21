import { writeFile } from "node:fs/promises";
import type { IncomingMessage, ServerResponse } from "node:http";
import { join } from "node:path";

import type { Post } from "#writing/posts-data";

export const RSS_PATH = "/feed.rss";
export const RSS_CONTENT_TYPE = "application/rss+xml; charset=utf-8";

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

const channel: RssChannel = {
    title: FEED_TITLE,
    description: FEED_DESCRIPTION,
    link: `${SITE_URL}/`,
    feedUrl: `${SITE_URL}${RSS_PATH}`,
    language: "en-US",
    copyright: "© Gustavo Ocanto",
};

function escapeXml(value: string): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");
}

function asCdata(value: string): string {
    return `<![CDATA[${value.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
}

function parsePostDate(post: Post): Date {
    const date = new Date(`${post.date.raw}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
        throw new Error(`Cannot generate RSS for ${post.url}: invalid date ${post.date.raw}`);
    }

    return date;
}

function toRssItems(posts: Post[]): RssItem[] {
    return posts
        .map((post) => {
            const link = new URL(post.url, `${SITE_URL}/`).toString();

            return {
                title: post.title,
                link,
                guid: link,
                publishedAt: parsePostDate(post),
                description: post.description,
                categories: post.tags,
            };
        })
        .sort((left, right) => right.publishedAt.getTime() - left.publishedAt.getTime());
}

export function renderRssFeed(posts: Post[]): string {
    const items = toRssItems(posts);
    const lastBuildDate = items[0]?.publishedAt;
    const lines = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
        "  <channel>",
        `    <title>${escapeXml(channel.title)}</title>`,
        `    <link>${escapeXml(channel.link)}</link>`,
        `    <description>${escapeXml(channel.description)}</description>`,
        `    <language>${escapeXml(channel.language)}</language>`,
        `    <copyright>${escapeXml(channel.copyright)}</copyright>`,
        `    <atom:link href="${escapeXml(channel.feedUrl)}" rel="self" type="application/rss+xml" />`,
    ];

    if (lastBuildDate) {
        lines.push(`    <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>`);
    }

    for (const item of items) {
        lines.push(
            "    <item>",
            `      <title>${escapeXml(item.title)}</title>`,
            `      <link>${escapeXml(item.link)}</link>`,
            `      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>`,
            `      <pubDate>${item.publishedAt.toUTCString()}</pubDate>`,
            `      <description>${asCdata(item.description)}</description>`,
        );

        for (const category of item.categories) {
            lines.push(`      <category>${escapeXml(category)}</category>`);
        }

        lines.push("    </item>");
    }

    lines.push("  </channel>", "</rss>", "");

    return lines.join("\n");
}

export async function loadRssFeed(): Promise<string> {
    const { default: postsLoader } = await import("#writing/posts-data");

    return renderRssFeed(await postsLoader.load());
}

export async function serveRssRequest(
    request: IncomingMessage,
    response: ServerResponse,
): Promise<boolean> {
    const pathname = new URL(request.url ?? "/", "http://localhost").pathname;

    if (pathname !== RSS_PATH || (request.method !== "GET" && request.method !== "HEAD")) {
        return false;
    }

    const rss = await loadRssFeed();

    response.statusCode = 200;
    response.setHeader("Content-Type", RSS_CONTENT_TYPE);
    response.setHeader("Cache-Control", "no-cache");
    response.end(request.method === "HEAD" ? undefined : rss);

    return true;
}

export async function writeRssFeed(outDir: string): Promise<void> {
    await writeFile(join(outDir, RSS_PATH.slice(1)), await loadRssFeed(), "utf8");
}
