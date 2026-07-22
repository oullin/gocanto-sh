import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { AppPageRegistry } from "#app/lib/page-registry";

/** Verifies the prerendered profile surface before it can be assembled for deployment. */
class AppSeoGuard {
    private readonly distDir: string;

    public constructor(distDir: string) {
        this.distDir = distDir;
    }

    public async run(): Promise<void> {
        const routes = [
            { path: "/", file: "index.html" },
            ...AppPageRegistry.all().map((page) => ({
                path: page.path,
                file: `${page.path.slice(1)}.html`,
            })),
        ];

        const titles = new Set<string>();
        const descriptions = new Set<string>();

        for (const route of routes) {
            const html = await readFile(
                resolve(this.distDir, route.file),
                "utf8",
            );

            const canonical = new URL(route.path, "https://gocanto.sh").toString();
            const title = this.capture(html, /<title>([^<]+)<\/title>/, route.path, "title");

            const description = this.capture(
                html,
                /<meta name="description" content="([^"]+)"\s*\/?>/,
                route.path,
                "description",
            );

            this.assertCount(html, /<h1(?:\s|>)/g, 1, route.path, "H1");
            this.assertCount(html, /<link rel="canonical"/g, 1, route.path, "canonical");
            this.assertCount(
                html,
                /<script type="application\/ld\+json">/g,
                1,
                route.path,
                "JSON-LD",
            );

            if (!html.includes(`href="${canonical}"`)) {
                throw new Error(
                    `[seo-guard] ${route.path} does not self-canonicalize to ${canonical}`,
                );
            }

            if (titles.has(title) || descriptions.has(description)) {
                throw new Error(`[seo-guard] duplicate metadata on ${route.path}`);
            }

            if (/@gmail\.com|\+65\s*8292|>References?</i.test(html)) {
                throw new Error(
                    `[seo-guard] private CV contact or reference content found on ${route.path}`,
                );
            }

            titles.add(title);
            descriptions.add(description);
        }

        console.log(`[seo-guard] verified ${routes.length} profile HTML routes`);
    }

    private capture(html: string, pattern: RegExp, path: string, label: string): string {
        const value = html.match(pattern)?.[1];

        if (!value) {
            throw new Error(`[seo-guard] ${path} is missing ${label}`);
        }

        return value;
    }

    private assertCount(
        html: string,
        pattern: RegExp,
        expected: number,
        path: string,
        label: string,
    ): void {
        const count = html.match(pattern)?.length ?? 0;

        if (count !== expected) {
            throw new Error(`[seo-guard] ${path} expected ${expected} ${label}; found ${count}`);
        }
    }
}

const appRoot = resolve(
    dirname(
        fileURLToPath(import.meta.url),
    ),
    "..",
);

await new AppSeoGuard(resolve(appRoot, "dist")).run();
