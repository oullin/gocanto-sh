import { createContentLoader } from "vitepress";

export interface Post {
    title: string;
    url: string;
    date: {
        raw: string;
        display: string;
        short: string;
        year: string;
    };
    readingTime: string;
    description: string;
    tags: string[];
}

// VitePress replaces this module's client-side import with the loaded data.
// The binding must exist at runtime (not `declare`) because the RSS build path
// imports this file directly through Node, which type-strips declarations.
export const data: Post[] = [];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
});

// ~200 wpm is the conventional reading pace; round up so a stub still reads
// "1 min".
function readingTime(src: string): string {
    const words = src
        .replace(/^---[\s\S]*?---/, "")
        .replace(/```[\s\S]*?```/g, "")
        .split(/\s+/)
        .filter(Boolean).length;

    return `${Math.max(1, Math.round(words / 200))} min`;
}

// YAML parses an unquoted `date: 2026-07-18` into a Date, and a quoted one
// into a string. Normalize both to a YYYY-MM-DD string before formatting.
function normalizeDate(value: unknown, url: string): string | null {
    if (value instanceof Date) {
        if (Number.isNaN(value.getTime())) {
            throw new Error(`Invalid date in post ${url}. Expected YYYY-MM-DD format.`);
        }

        return value.toISOString().slice(0, 10);
    }

    return typeof value === "string" ? value : null;
}

function formatDate(raw: string, url: string): Post["date"] {
    const date = new Date(`${raw}T00:00:00Z`);

    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== raw) {
        throw new Error(`Invalid date "${raw}" in post ${url}. Expected YYYY-MM-DD format.`);
    }

    return {
        raw,
        display: dateFormatter.format(date),
        short: shortDateFormatter.format(date),
        year: String(date.getUTCFullYear()),
    };
}

function normalizeTags(value: unknown): string[] {
    if (Array.isArray(value)) {
        return value.filter((tag): tag is string => typeof tag === "string");
    }

    return typeof value === "string" ? [value] : [];
}

export default createContentLoader("posts/*.md", {
    excerpt: true,
    includeSrc: true,
    transform(raw): Post[] {
        return raw
            .flatMap((page) => {
                const raw = normalizeDate(page.frontmatter.date, page.url);

                return raw ? [{ page, raw }] : [];
            })
            .map(({ page: { url, frontmatter, excerpt, src }, raw }) => {
                // `rewrites` publishes posts/:slug at the top level, so strip the
                // posts/ prefix to match the actual (clean) URL.
                const postUrl = url.replace(/^\/posts\//, "/");

                return {
                    title: frontmatter.title ?? url,
                    url: postUrl,
                    date: formatDate(raw, postUrl),
                    readingTime: readingTime(src ?? ""),
                    description: frontmatter.description ?? excerpt ?? "",
                    tags: normalizeTags(frontmatter.tags),
                };
            })
            .sort((a, b) => b.date.raw.localeCompare(a.date.raw));
    },
});
