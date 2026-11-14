import type { Post } from "#writing/posts";

export type Nullable<T> = T | null;

/** One semantic match returned by the search Worker. */
export type SearchHit = {
    readonly score: number;
    readonly title: string;
    readonly url: string;
};

/**
 * Client for the search Worker, reached through a same-origin Vercel rewrite.
 * Every failure resolves to null so callers fall back to local search or
 * tag-based related posts.
 */
export class SemanticSearch {
    static readonly endpoint = "/api/search/query";

    private static readonly timeoutMs = 4000;

    constructor(private readonly endpoint: string = SemanticSearch.endpoint) {}

    async query(q: string): Promise<Nullable<Array<SearchHit>>> {
        try {
            const res = await fetch(
                this.endpoint,
                {
                    body: JSON.stringify({ q }),
                    headers: { "content-type": "application/json" },
                    method: "POST",
                    signal: AbortSignal.timeout(SemanticSearch.timeoutMs),
                },
            );

            return res.ok ? SemanticSearch.hits(await res.json()) : null;
        } catch {
            return null;
        }
    }

    /** Accept only an array of well-formed hits. */
    static hits(value: unknown): Nullable<Array<SearchHit>> {
        if (!Array.isArray(value)) {
            return null;
        }

        return value.filter(
            (hit): hit is SearchHit =>
                typeof hit?.url === "string" &&
                typeof hit.title === "string" &&
                typeof hit.score === "number",
        );
    }

    /** The query text used to find posts related to the current one. */
    static relatedQuery(post: Post): string {
        return `${post.title}. ${post.description}`;
    }

    /** Map hits to known posts, dropping the current post and unknown urls. */
    static related(
        hits: ReadonlyArray<SearchHit>,
        posts: ReadonlyArray<Post>,
        current: string,
        limit: number,
    ): Array<Post> {
        const byUrl = new Map(posts.map((post) => [post.url, post]));

        return hits
            .filter((hit) => hit.url !== current)
            .flatMap((hit) => byUrl.get(hit.url) ?? [])
            .slice(0, limit);
    }
}
