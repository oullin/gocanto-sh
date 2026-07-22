import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { Post } from "#writing/posts";

/** Emits the writing discovery index and canonical raw Markdown resources. */
export class WritingBundle {
    private readonly sourceDir: string;
    private readonly outDir: string;

    public constructor(sourceDir: string, outDir: string) {
        this.sourceDir = sourceDir;
        this.outDir = outDir;
    }

    public static renderIndex(posts: readonly Post[]): string {
        const entries = posts
            .map(
                (post) =>
                    `- [${post.title}](${post.canonicalUrl}): ${post.description}\n` +
                    `  - [Raw Markdown](${post.canonicalUrl}.md)\n` +
                    `  - Published ${post.date.raw}; updated ${post.modifiedAt}; topics: ${post.tags.join(", ")}`,
            )
            .join("\n");

        return `# Gustavo Ocanto: Writing

> First-hand engineering field notes on regulated systems, payments, banking modernisation, reliable delivery, and production AI.

## Author

- [Gustavo Ocanto](https://gocanto.sh/): Software Architect for Regulated Systems.
- [Public resume](https://gocanto.sh/resume)

## Posts

${entries}
`;
    }

    public async write(posts: readonly Post[]): Promise<void> {
        await mkdir(
            this.outDir,
            { recursive: true },
        );

        for (const post of posts) {
            const slug = this.slug(post.url);

            const source = await readFile(
                join(this.sourceDir, `${slug}.md`),
                "utf8",
            );

            await writeFile(
                join(this.outDir, `${slug}.md`),
                source.endsWith("\n") ? source : `${source}\n`,
                "utf8",
            );
        }

        await writeFile(
            join(this.outDir, "llms.txt"),
            WritingBundle.renderIndex(posts),
            "utf8",
        );
    }

    private slug(url: string): string {
        const slug = url.replace(/^\//, "").replace(/\/$/, "");

        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            throw new Error(`Unsafe writing bundle path: ${url}`);
        }

        return slug;
    }
}
