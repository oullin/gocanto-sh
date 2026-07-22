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

/**
 * Pure topic-filter and list behavior for the writing index, kept free of Vue
 * and the DOM. Full-text search is VitePress's local-search provider, the same
 * one the article header uses, so it has no counterpart here.
 */
export class WritingIndexSearch {
    /** The topic selection that disables topic filtering. */
    static readonly allTopics: TopicSelection = "all";

    private constructor() {}

    /** Construct a topic tag from post metadata. */
    static topicTag(value: string): TopicTag {
        // SAFETY: Every post metadata tag is a valid topic tag; the brand prevents unrelated strings at callsites.
        return value as TopicTag;
    }

    /** Filter posts by the active topic. */
    static filterPosts(posts: readonly Post[], topic: TopicSelection): Post[] {
        return posts.filter(
            (post) => topic === WritingIndexSearch.allTopics || post.tags.includes(topic),
        );
    }

    /** True when a topic narrows the index away from its default view. */
    static isFiltering(topic: TopicSelection): boolean {
        return topic !== WritingIndexSearch.allTopics;
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

    /** Return the most-used topics, capped so the rail stays a short scan list. */
    static topTopics(posts: readonly Post[], limit = 8): TopicCount[] {
        return WritingIndexSearch.tagCounts(posts).slice(0, limit);
    }

    /**
     * Format a post count with the correct singular or plural noun. Pass `matched`
     * while filtering to render the design's "3 of 12 posts" form.
     */
    static countLabel(total: number, matched: number | null = null): string {
        const noun = total === 1 ? "post" : "posts";

        return matched === null ? `${total} ${noun}` : `${matched} of ${total} ${noun}`;
    }

    /** The oldest–newest year span covered by the archive, collapsed when it is one year. */
    static yearRange(posts: readonly Post[]): string {
        const years = posts.map((post) => post.date.year).sort();
        const oldest = years[0];
        const newest = years[years.length - 1];

        if (!oldest || !newest) {
            return String(
                new Date().getFullYear(),
            );
        }

        return oldest === newest ? newest : `${oldest}–${newest}`;
    }

    /**
     * The archive rows. The featured post is promoted above the list on the
     * default view, so it is dropped here; while filtering there is no featured
     * card and every match is listed.
     */
    static archivePosts(posts: readonly Post[], featured?: Post, filtering = false): Post[] {
        if (filtering || !featured) {
            return [...posts];
        }

        return posts.filter((post) => post.url !== featured.url);
    }
}
