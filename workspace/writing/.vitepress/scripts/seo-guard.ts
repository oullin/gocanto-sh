import { readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** Verifies canonical article metadata and heading structure in built writing pages. */
class WritingSeoGuard {
    private readonly distDir: string;

    public constructor(distDir: string) {
        this.distDir = distDir;
    }

    public async run(): Promise<void> {
        const pages = (await readdir(this.distDir))
            .filter((file) => file.endsWith(".html") && file !== "404.html")
            .sort();

        const canonicals = new Set<string>();

        for (const file of pages) {
            const html = await readFile(
                join(this.distDir, file),
                "utf8",
            );

            const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];

            this.assertCount(html, /<h1(?:\s|>)/g, 1, file, "H1");
            this.assertCount(html, /<link rel="canonical"/g, 1, file, "canonical");
            this.assertCount(html, /<meta name="description"/g, 1, file, "description");
            this.assertCount(
                html,
                /<script type="application\/ld\+json">/g,
                1,
                file,
                "inline JSON-LD",
            );

            if (!canonical || canonicals.has(canonical)) {
                throw new Error(`[writing-seo-guard] ${file} has a missing or duplicate canonical`);
            }

            const expectedType = file === "index.html" ? "website" : "article";

            if (!html.includes(`property="og:type" content="${expectedType}"`)) {
                throw new Error(`[writing-seo-guard] ${file} has the wrong Open Graph type`);
            }

            if (!html.includes(`property="og:url" content="${canonical}"`)) {
                throw new Error(
                    `[writing-seo-guard] ${file} Open Graph URL differs from canonical`,
                );
            }

            if (file !== "index.html" && !html.includes('"@type":"BlogPosting"')) {
                throw new Error(`[writing-seo-guard] ${file} is missing BlogPosting JSON-LD`);
            }

            if (file !== "index.html") {
                this.assertCount(
                    html,
                    /<meta property="article:published_time" content="\d{4}-\d{2}-\d{2}">/g,
                    1,
                    file,
                    "article publication date",
                );
                this.assertCount(
                    html,
                    /<meta property="article:modified_time" content="\d{4}-\d{2}-\d{2}">/g,
                    1,
                    file,
                    "article modified date",
                );
                this.assertCount(
                    html,
                    /"datePublished":"\d{4}-\d{2}-\d{2}"/g,
                    1,
                    file,
                    "JSON-LD publication date",
                );
                this.assertCount(
                    html,
                    /"dateModified":"\d{4}-\d{2}-\d{2}"/g,
                    1,
                    file,
                    "JSON-LD modified date",
                );
            }

            canonicals.add(canonical);
        }

        console.log(`[writing-seo-guard] verified ${pages.length} canonical writing pages`);
    }

    private assertCount(
        html: string,
        pattern: RegExp,
        expected: number,
        file: string,
        label: string,
    ): void {
        const count = html.match(pattern)?.length ?? 0;

        if (count !== expected) {
            throw new Error(
                `[writing-seo-guard] ${file} expected ${expected} ${label}; found ${count}`,
            );
        }
    }
}

const here = dirname(
    fileURLToPath(import.meta.url),
);

await new WritingSeoGuard(resolve(here, "../dist")).run();
