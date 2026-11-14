import { Doc } from "#search/doc";
import type { Env, Hit, Meta, Source } from "#search/types";

type Embeddings = { data: Array<{ embedding: Array<number> }> };

/** Embeds with EmbeddingGemma 2 and reads and writes the Vectorize index. */
export class Search {
    static readonly model = "@cf/google/embeddinggemma-2";
    static readonly limit = 5;

    // Several chunks of one post can match, so fetch extra and keep the best per post.
    private static readonly candidates = 20;
    private static readonly batch = 10;

    constructor(private readonly env: Env) {}

    async query(q: string): Promise<Array<Hit>> {
        const [values] = await this.embed([Doc.query(q)]);

        const { matches } = await this.env.VECTORIZE.query(values, {
            returnMetadata: "all",
            topK: Search.candidates,
        });

        const best = new Map<string, Hit>();

        for (const match of matches) {
            const meta = match.metadata as Partial<Meta> | undefined;

            if (!meta?.url || !meta.title || best.has(meta.url)) {
                continue;
            }

            best.set(meta.url, { score: match.score, title: meta.title, url: meta.url });
        }

        return [...best.values()].slice(0, Search.limit);
    }

    /** Embed every post from the source and upsert it. Returns the vector count. */
    async index(source: Source): Promise<number> {
        const items: Array<{ id: string; metadata: Meta; text: string }> = [];

        for (const post of await source.posts()) {
            const id = await Search.id(post.url);

            const metadata = { title: post.title, url: post.url } satisfies Meta;

            Doc.texts(post).forEach((text, i) => items.push({ id: `${id}-${i}`, metadata, text }));
        }

        for (let i = 0; i < items.length; i += Search.batch) {
            const slice = items.slice(i, i + Search.batch);

            const values = await this.embed(slice.map((item) => item.text));

            await this.env.VECTORIZE.upsert(
                slice.map(({ id, metadata }, j) => ({ id, metadata, values: values[j] })),
            );
        }

        return items.length;
    }

    private async embed(input: Array<string>): Promise<Array<Array<number>>> {
        const res = (await this.env.AI.run(Search.model, { input })) as Embeddings;

        return res.data.map((row) => row.embedding);
    }

    // Vector ids cap at 64 bytes and the longest slug is already 64, so hash the url.
    private static async id(url: string): Promise<string> {
        const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(url));

        const bytes = new Uint8Array(digest, 0, 16);

        return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    }
}
