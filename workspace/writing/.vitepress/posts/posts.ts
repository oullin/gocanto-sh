import type { ContentData } from "vitepress";

import type { Post } from "#writing/posts";

/** Normalizes VitePress content data into writing posts. */
export class Posts {
    private static readonly siteUrl = "https://writing.gocanto.sh";
    private static readonly defaultImage = `${Posts.siteUrl}/og-image.png`;
    private static readonly dateFormatter = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
    });

    private static readonly shortDateFormatter = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        timeZone: "UTC",
    });

    private constructor() {}

    /** Transforms raw VitePress content into normalized, newest-first posts. */
    public static transform(raw: ContentData[]): Post[] {
        return raw
            .flatMap((page) => {
                const raw = Posts.normalizeDate(page.frontmatter.date, page.url);

                return raw ? [{ page, raw }] : [];
            })
            .map(({ page: { url, frontmatter, src }, raw }) => {
                Posts.assertNoTopLevelHeading(src ?? "", url);

                // `rewrites` publishes posts/:slug at the top level, so strip the
                // posts/ prefix to match the actual (clean) URL.
                const postUrl = url.replace(/^\/posts\//, "/");
                const modifiedAt = Posts.normalizeDate(frontmatter.updated, postUrl) ?? raw;

                return {
                    title: frontmatter.title ?? url,
                    url: postUrl,
                    canonicalUrl: new URL(postUrl, `${Posts.siteUrl}/`).toString(),
                    date: Posts.formatDate(raw, postUrl),
                    modifiedAt: Posts.formatDate(modifiedAt, postUrl).raw,
                    image: Posts.normalizeImage(frontmatter.image),
                    readingTime: Posts.readingTime(src ?? ""),
                    description: Posts.requireDescription(frontmatter.description, postUrl),
                    tags: Posts.normalizeTags(frontmatter.tags),
                };
            })
            .sort((a, b) => b.date.raw.localeCompare(a.date.raw));
    }

    // ~200 wpm is the conventional reading pace; round up so a stub still reads
    // "1 min".
    public static readingTime(src: string): string {
        const words = src
            .replace(/^---[\s\S]*?---/, "")
            .replace(/```[\s\S]*?```/g, "")
            .split(/\s+/)
            .filter(Boolean).length;

        return `${Math.max(1, Math.round(words / 200))} min`;
    }

    // YAML parses an unquoted `date: 2026-07-18` into a Date, and a quoted one
    // into a string. Normalize both to a YYYY-MM-DD string before formatting.
    public static normalizeDate(value: unknown, url: string): string | null {
        if (value instanceof Date) {
            if (Number.isNaN(value.getTime())) {
                throw new Error(`Invalid date in post ${url}. Expected YYYY-MM-DD format.`);
            }

            return value.toISOString().slice(0, 10);
        }

        return typeof value === "string" ? value : null;
    }

    public static formatDate(raw: string, url: string): Post["date"] {
        const date = new Date(`${raw}T00:00:00Z`);

        if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== raw) {
            throw new Error(`Invalid date "${raw}" in post ${url}. Expected YYYY-MM-DD format.`);
        }

        return {
            raw,
            display: Posts.dateFormatter.format(date),
            short: Posts.shortDateFormatter.format(date),
            year: String(
                date.getUTCFullYear(),
            ),
        };
    }

    /**
     * Descriptions must be authored, never derived.
     *
     * The loader runs with `excerpt: true`, so falling back to the excerpt would
     * feed VitePress-rendered HTML into the RSS feed, the meta tags, and the
     * llms index — all of which expect plain text.
     */
    public static requireDescription(value: unknown, url: string): string {
        const description = typeof value === "string" ? value.trim() : "";

        if (description === "") {
            throw new Error(`Post ${url} is missing a frontmatter description.`);
        }

        return description;
    }

    public static normalizeTags(value: unknown): string[] {
        if (Array.isArray(value)) {
            return value.filter((tag): tag is string => typeof tag === "string");
        }

        return typeof value === "string" ? [value] : [];
    }

    /** Resolve a post image to an absolute, crawlable URL. */
    public static normalizeImage(value: unknown): string {
        if (typeof value !== "string" || value.trim() === "") {
            return Posts.defaultImage;
        }

        return new URL(value, `${Posts.siteUrl}/`).toString();
    }

    /** The layout owns the single article H1; post bodies must begin below it. */
    public static assertNoTopLevelHeading(source: string, url: string): void {
        const body = source.replace(/^---[\s\S]*?---/, "").replace(/```[\s\S]*?```/g, "");

        if (/^#\s+/m.test(body)) {
            throw new Error(
                `Post ${url} contains a top-level heading. The article layout renders the H1.`,
            );
        }
    }
}
