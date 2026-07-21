import type { Post } from "#writing/posts";

/** A topic tag attached to a writing post. */
export type TopicTag = string & { readonly __brand: "TopicTag" };

/** The active topic filter, including the sentinel that selects every topic. */
export type TopicSelection = "all" | TopicTag;

/** A topic and the number of posts tagged with it. */
export type TopicCount = {
    readonly tag: TopicTag;
    readonly count: number;
};

/** Pure search and list behavior for the writing index, kept free of Vue and the DOM. */
export class WritingIndexSearch {
    /** The topic selection that disables topic filtering. */
    static readonly allTopics: TopicSelection = "all";

    private constructor() {}

    /** Construct a topic tag from post metadata. */
    static topicTag(value: string): TopicTag {
        // SAFETY: Every post metadata tag is a valid topic tag; the brand prevents unrelated strings at callsites.
        return value as TopicTag;
    }

    /** Case-insensitively match a query against a post's title, description, and tags. */
    static matchesQuery(post: Post, query: string): boolean {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) {
            return true;
        }

        return `${post.title} ${post.description} ${post.tags.join(" ")}`
            .toLowerCase()
            .includes(normalizedQuery);
    }

    /** Filter posts by the active topic and search query. */
    static filterPosts(posts: readonly Post[], query: string, topic: TopicSelection): Post[] {
        return posts.filter(
            (post) =>
                (topic === WritingIndexSearch.allTopics || post.tags.includes(topic)) &&
                WritingIndexSearch.matchesQuery(post, query),
        );
    }

    /** Return all topic counts, ordered by frequency and then alphabetically. */
    static tagCounts(posts: readonly Post[]): TopicCount[] {
        const counts = new Map<TopicTag, number>();

        for (const post of posts) {
            for (const rawTag of new Set(post.tags)) {
                const tag = WritingIndexSearch.topicTag(rawTag);

                counts.set(tag, (counts.get(tag) ?? 0) + 1);
            }
        }

        return [...counts]
            .map(([tag, count]) => ({ tag, count }))
            .sort((left, right) => right.count - left.count || left.tag.localeCompare(right.tag));
    }

    /** Format a post count with the correct singular or plural noun. */
    static countLabel(count: number): string {
        return `${count} ${count === 1 ? "post" : "posts"}`;
    }

    /** Exclude the featured post unless doing so would leave an existing list empty. */
    static listPosts(posts: readonly Post[], featured?: Post): Post[] {
        const withoutFeatured = posts.filter((post) => !(featured && post.url === featured.url));

        return withoutFeatured.length ? withoutFeatured : [...posts];
    }
}
