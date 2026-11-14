import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { App } from "#search/app";
import { Doc } from "#search/doc";
import type { Embedder, Env, Hit, Post, Source } from "#search/types";

const POSTS = join(import.meta.dirname, "../../writing/posts");
const TOKEN = "test-token";

/** Hashed bag of words: enough for word overlap to rank posts, and deterministic. */
class Words implements Embedder {
    readonly calls: Array<Array<string>> = [];

    run(_model: string, { input }: { input: Array<string> }) {
        this.calls.push(input);

        return Promise.resolve({ data: input.map((text) => ({ embedding: Words.vector(text) })) });
    }

    private static vector(text: string): Array<number> {
        const body = text.replace(/^task: search result \| query: |^title: /, "");
        const values = new Array<number>(768).fill(0);

        for (const word of body.toLowerCase().match(/[a-z]{4,}/g) ?? []) {
            let h = 0;

            for (const c of word) {
                h = (h * 31 + c.charCodeAt(0)) >>> 0;
            }

            values[h % 768] += 1;
        }

        return values;
    }
}

/** In-memory cosine index with the Vectorize query and upsert shapes. */
class Memory {
    readonly rows = new Map<string, VectorizeVector>();

    upsert(vectors: Array<VectorizeVector>) {
        vectors.forEach((v) => this.rows.set(v.id, v));

        return Promise.resolve({ mutationId: "m" } as VectorizeAsyncMutation);
    }

    query(values: VectorFloatArray | Array<number>, options?: VectorizeQueryOptions) {
        const q = [...values];

        const matches = [...this.rows.values()]
            .map((row) => ({
                id: row.id,
                metadata: row.metadata,
                score: Memory.cosine(q, [...row.values]),
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, options?.topK ?? 5);

        return Promise.resolve({ count: matches.length, matches } as VectorizeMatches);
    }

    private static cosine(a: Array<number>, b: Array<number>): number {
        let dot = 0;
        let na = 0;
        let nb = 0;

        a.forEach((x, i) => {
            dot += x * b[i];
            na += x * x;
            nb += b[i] * b[i];
        });

        return na && nb ? dot / Math.sqrt(na * nb) : 0;
    }
}

class Disk implements Source {
    async posts(): Promise<Array<Post>> {
        const files = (await readdir(POSTS)).filter((f) => f.endsWith(".md"));

        const posts = await Promise.all(
            files.map(async (f) =>
                Doc.parse(`/${f.replace(/\.md$/, "")}`, await readFile(join(POSTS, f), "utf8")),
            ),
        );

        return posts.filter((p): p is Post => p !== null);
    }
}

function setup() {
    const ai = new Words();
    const vectorize = new Memory();

    const env = {
        AI: ai,
        INDEX_TOKEN: TOKEN,
        SITE_URL: "https://writing.gocanto.sh",
        VECTORIZE: vectorize,
    } satisfies Env;

    const app = new App(env, new Disk());

    return { ai, app, vectorize };
}

function post(path: string, body: unknown, token?: string): Request {
    return new Request(`https://writing.gocanto.sh${path}`, {
        body: JSON.stringify(body),
        headers: token ? { authorization: `Bearer ${token}` } : {},
        method: "POST",
    });
}

describe("App", () => {
    it("indexes every post and answers queries with deduplicated hits", async () => {
        const { ai, app, vectorize } = setup();

        const indexed = await app.handle(post("/api/search/index", {}, TOKEN));

        expect(indexed.status).toBe(200);

        expect(await indexed.json()).toEqual({ vectors: 34 });

        expect(vectorize.rows.size).toBe(34);
        expect(
            [...vectorize.rows.keys()].every((id) => /^[0-9a-f]{32}-\d+$/.test(id)),
        ).toBe(true);
        expect(
            ai.calls.flat().every((text) => text.startsWith("title: ")),
        ).toBe(true);

        const res = await app.handle(
            post("/api/search/query", { q: "real-time feature store for fraud" }),
        );

        const hits = (await res.json()) as Array<Hit>;

        expect(
            ai.calls.at(-1),
        ).toEqual([
            "task: search result | query: real-time feature store for fraud",
        ]);
        expect(hits).toHaveLength(5);
        expect(hits[0].url).toBe("/when-a-real-time-feature-store-is-the-wrong-fix-for-fraud");
        expect(new Set(hits.map((h) => h.url)).size).toBe(5);
        expect(
            Object.keys(hits[0]).sort(),
        ).toEqual(["score", "title", "url"]);
    });

    it("rejects indexing without the bearer token", async () => {
        const { app, vectorize } = setup();

        expect((await app.handle(post("/api/search/index", {}))).status).toBe(401);

        expect((await app.handle(post("/api/search/index", {}, "wrong"))).status).toBe(401);

        expect(vectorize.rows.size).toBe(0);
    });

    it("validates the query", async () => {
        const { app } = setup();

        expect((await app.handle(post("/api/search/query", { q: "  " }))).status).toBe(400);

        expect((await app.handle(post("/api/search/query", { q: "x".repeat(201) }))).status).toBe(
            400,
        );

        expect((await app.handle(new Request("https://w/api/search/query"))).status).toBe(405);

        expect((await app.handle(new Request("https://w/nope"))).status).toBe(404);
    });
});

describe("Doc", () => {
    it("keeps each chunk under the limit and prefixes the title", () => {
        const body = Array.from(
            { length: 50 },
            (_, i) => `Paragraph ${i} ${"word ".repeat(80)}`,
        ).join("\n\n");

        const texts = Doc.texts({ body, title: "A", url: "/a" }, 2000);

        expect(texts.length).toBeGreaterThan(1);
        expect(
            texts.every((t) => t.length <= 2000 && t.startsWith("title: A | text: ")),
        ).toBe(
            true,
        );
    });

    it("hard-splits a paragraph longer than the limit", () => {
        expect(
            Doc.chunks("x".repeat(25), 10),
        ).toEqual([
            "x".repeat(10),
            "x".repeat(10),
            "x".repeat(5),
        ]);
    });

    it("skips Markdown without a title", () => {
        expect(
            Doc.parse("/a", "no frontmatter"),
        ).toBeNull();
        expect(
            Doc.parse("/a", '---\ntitle: "Quoted"\n---\nBody'),
        ).toEqual({
            body: "Body",
            title: "Quoted",
            url: "/a",
        });
    });
});
