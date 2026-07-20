import type { Post } from "../../posts.data";

/**
 * Pure search/filter helpers for the writing index. Kept free of Vue/DOM so the
 * behaviour that drives the header search + tag filter is unit-testable.
 */

export interface YearGroup {
    year: string;
    count: string;
    items: Post[];
}

/** Case-insensitive match of a query against a post's title, description and tags. */
export function matchesQuery(post: Post, query: string): boolean {
    const q = query.trim().toLowerCase();

    if (!q) {
        return true;
    }

    return `${post.title} ${post.description} ${post.tags.join(" ")}`.toLowerCase().includes(q);
}

/** Filter posts by the active tag ("all" = no tag filter) and the search query. */
export function filterPosts(posts: readonly Post[], query: string, tag: string): Post[] {
    return posts.filter((p) => (tag === "all" || p.tags.includes(tag)) && matchesQuery(p, query));
}

/** Chip labels: "all" first, then the most-used tags, capped at `limit`. */
export function topTags(posts: readonly Post[], limit = 8): string[] {
    const counts = new Map<string, number>();

    for (const p of posts) {
        for (const t of p.tags) {
            counts.set(t, (counts.get(t) ?? 0) + 1);
        }
    }

    const top = [...counts.keys()].sort((a, b) => counts.get(b)! - counts.get(a)!).slice(0, limit);

    return ["all", ...top];
}

export function countLabel(n: number): string {
    return `${n} ${n === 1 ? "post" : "posts"}`;
}

/**
 * Group posts by year (newest years first, as ordered in `posts`). The featured
 * post is dropped so it isn't shown twice — unless it's the only post, in which
 * case it's still listed rather than leaving the list empty.
 */
export function groupByYear(posts: readonly Post[], featured?: Post): YearGroup[] {
    const withoutFeatured = posts.filter((p) => !(featured && p.url === featured.url));
    const list = withoutFeatured.length ? withoutFeatured : [...posts];
    const years = [...new Set(list.map((p) => p.date.year))];

    return years.map((year) => {
        const items = list.filter((p) => p.date.year === year);

        return { year, count: countLabel(items.length), items };
    });
}
