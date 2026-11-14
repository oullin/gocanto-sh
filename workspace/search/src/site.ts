import { Doc } from "#search/doc";
import type { Post, Source } from "#search/types";

/**
 * Reads posts from the published writing site: llms.txt lists every post's
 * raw Markdown, so the index always matches what is live.
 */
export class Site implements Source {
    constructor(
        private readonly origin: string,
        // Wrapped so fetch is never called with `this` set to Site; workerd throws on that.
        private readonly get: typeof fetch = (input, init) => fetch(input, init),
    ) {}

    async posts(): Promise<Array<Post>> {
        const index = await this.text(`${this.origin}/llms.txt`);

        const links = [...index.matchAll(/\[Raw Markdown\]\((\S+?\.md)\)/g)].map((m) => m[1]);
        const posts: Array<Post> = [];

        for (const link of links) {
            const url = new URL(link).pathname.replace(/\.md$/, "");

            const post = Doc.parse(url, await this.text(link));

            if (post) {
                posts.push(post);
            }
        }

        return posts;
    }

    private async text(url: string): Promise<string> {
        const res = await this.get(url);

        if (!res.ok) {
            throw new Error(`GET ${url} returned ${res.status}`);
        }

        return res.text();
    }
}
