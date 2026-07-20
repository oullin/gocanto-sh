import type { Post } from "../../posts.data";

/** Pure filter/list helpers for the writing index, kept free of Vue and the DOM. */

/** Case-insensitive match of a query against a post's title, description and tags. */
export function matchesQuery(post: Post, query: string): boolean {
    const q = query.trim().toLowerCase();

    if (!q) return true;

    return `${post.title} ${post.description} ${post.tags.join(" ")}`.toLowerCase().includes(q);
}

/** Filter posts by the active tag ("all" = no tag filter) and the search query. */
export function filterPosts(posts: readonly Post[], query: string, tag: string): Post[] {
    return posts.filter((p) => (tag === "all" || p.tags.includes(tag)) && matchesQuery(p, query));
}

/** All topic counts, ordered by frequency and then alphabetically. */
export function tagCounts(posts: readonly Post[]): { tag: string; count: number }[] {
    const counts = new Map<string, number>();

    for (const p of posts) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);

    return [...counts]
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function countLabel(n: number): string {
    return `${n} ${n === 1 ? "post" : "posts"}`;
}

/** Exclude the featured post unless doing so would leave an existing list empty. */
export function listPosts(posts: readonly Post[], featured?: Post): Post[] {
    const withoutFeatured = posts.filter((p) => !(featured && p.url === featured.url));

    return withoutFeatured.length ? withoutFeatured : [...posts];
}
