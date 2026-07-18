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

declare const data: Post[];
export { data };

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
function normalizeDate(value: unknown): string | null {
    if (value instanceof Date) {
        return value.toISOString().slice(0, 10);
    }

    return typeof value === "string" ? value : null;
}

function formatDate(raw: string): Post["date"] {
    const date = new Date(`${raw}T00:00:00Z`);

    return {
        raw,
        display: dateFormatter.format(date),
        short: shortDateFormatter.format(date),
        year: String(date.getUTCFullYear()),
    };
}

export default createContentLoader("posts/*.md", {
    excerpt: true,
    includeSrc: true,
    transform(raw): Post[] {
        return raw
            .flatMap((page) => {
                const raw = normalizeDate(page.frontmatter.date);
                return raw ? [{ page, raw }] : [];
            })
            .map(({ page: { url, frontmatter, excerpt, src }, raw }) => ({
                title: frontmatter.title ?? url,
                // `rewrites` publishes posts/:slug at the top level, so strip the
                // posts/ prefix to match the actual (clean) URL.
                url: url.replace(/^\/posts\//, "/"),
                date: formatDate(raw),
                readingTime: readingTime(src ?? ""),
                description: frontmatter.description ?? excerpt ?? "",
                tags: frontmatter.tags ?? [],
            }))
            .sort((a, b) => +new Date(b.date.raw) - +new Date(a.date.raw));
    },
});
