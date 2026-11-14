export type Nullable<T> = T | null;

/** The slice of the Workers AI binding this Worker calls. */
export interface Embedder {
    run(model: string, inputs: { input: Array<string> }): Promise<unknown>;
}

export interface Env {
    AI: Embedder;
    INDEX_TOKEN?: string;
    SITE_URL: string;
    VECTORIZE: Pick<Vectorize, "query" | "upsert">;
}

/** One search result, deduplicated to a post. */
export type Hit = {
    score: number;
    title: string;
    url: string;
};

/** A published post as the indexer reads it. */
export type Post = {
    body: string;
    title: string;
    url: string;
};

/** Metadata stored with every vector. */
export type Meta = {
    title: string;
    url: string;
};

/** Where the indexer gets posts from. */
export interface Source {
    posts(): Promise<Array<Post>>;
}
