import type { Nullable, Post } from "#search/types";

/**
 * Turns one Markdown post into the document text EmbeddingGemma 2 expects.
 *
 * The model reads 8,192 tokens per embedding. Prose runs at about four
 * characters a token and code nearer three, so 16,000 characters keeps each
 * chunk well under the limit. Every post today fits in one chunk.
 */
export class Doc {
    static readonly maxChars = 16_000;

    private constructor() {}

    /** Parse raw Markdown with frontmatter into a post, or null without a title. */
    static parse(url: string, markdown: string): Nullable<Post> {
        const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(markdown);
        const front = match?.[1] ?? "";

        const title = /^title:\s*(.+)$/m
            .exec(front)?.[1]
            ?.trim()
            .replaceAll(/^["']|["']$/g, "");

        if (!title) {
            return null;
        }

        return { body: markdown.slice(match?.[0].length ?? 0).trim(), title, url };
    }

    /** Split a post into prefixed document texts, each under the size limit. */
    static texts(post: Post, maxChars = Doc.maxChars): Array<string> {
        const prefix = `title: ${post.title} | text: `;

        return Doc.chunks(post.body, maxChars - prefix.length).map((chunk) => prefix + chunk);
    }

    /** Pack paragraphs into chunks; hard-split any paragraph longer than the limit. */
    static chunks(body: string, maxChars: number): Array<string> {
        const parts = body
            .split(/\n{2,}/)
            .flatMap((part) =>
                part.length <= maxChars
                    ? [part]
                    : Array.from({ length: Math.ceil(part.length / maxChars) }, (_, i) =>
                          part.slice(i * maxChars, (i + 1) * maxChars),
                      ),
            );

        const chunks: Array<string> = [];

        let current = "";

        for (const part of parts) {
            const next = current ? `${current}\n\n${part}` : part;

            if (next.length > maxChars && current) {
                chunks.push(current);
                current = part;
            } else {
                current = next;
            }
        }

        if (current) {
            chunks.push(current);
        }

        return chunks;
    }

    /** The query text for search. */
    static query(q: string): string {
        return `task: search result | query: ${q}`;
    }
}
