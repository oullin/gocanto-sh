import type { Post } from "#writing/posts";

/** A year-based group of writing posts. */
export interface YearGroup {
    year: string;
    count: string;
    items: Post[];
}

/** Pure search and grouping utilities for writing posts. */
export class PostSearch {
    private constructor() {}

    /** Matches a query against a post's title, description, and tags. */
    public static matchesQuery(post: Post, query: string): boolean {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) {
            return true;
        }

        return `${post.title} ${post.description} ${post.tags.join(" ")}`
            .toLowerCase()
            .includes(normalizedQuery);
    }

    /** Filters posts by an active tag and search query. */
    public static filter(posts: readonly Post[], query: string, tag: string): Post[] {
        return posts.filter(
            (post) =>
                (tag === "all" || post.tags.includes(tag)) && PostSearch.matchesQuery(post, query),
        );
    }

    /** Returns the most-used tag labels with the all-posts label first. */
    public static topTags(posts: readonly Post[], limit = 8): string[] {
        const counts = new Map<string, number>();

        for (const post of posts) {
            for (const tag of post.tags) {
                counts.set(tag, (counts.get(tag) ?? 0) + 1);
            }
        }

        const top = [...counts.keys()]
            .sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0))
            .slice(0, limit);

        return ["all", ...top];
    }

    /** Formats a plural-aware post count. */
    public static countLabel(count: number): string {
        return `${count} ${count === 1 ? "post" : "posts"}`;
    }

    /** Groups posts by year while avoiding a duplicate featured post. */
    public static groupByYear(posts: readonly Post[], featured?: Post): YearGroup[] {
        const withoutFeatured = posts.filter((post) => !(featured && post.url === featured.url));
        const list = withoutFeatured.length ? withoutFeatured : [...posts];
        const years = [...new Set(list.map((post) => post.date.year))];

        return years.map((year) => {
            const items = list.filter((post) => post.date.year === year);

            return { year, count: PostSearch.countLabel(items.length), items };
        });
    }
}
