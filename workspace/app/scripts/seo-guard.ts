import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** Verifies the prerendered profile surface before it can be assembled for deployment. */
class AppSeoGuard {
    private static readonly route = { path: "/", file: "index.html" };

    private readonly distDir: string;

    public constructor(distDir: string) {
        this.distDir = distDir;
    }

    public async run(): Promise<void> {
        const { path, file } = AppSeoGuard.route;

        const html = await readFile(
            resolve(this.distDir, file),
            "utf8",
        );

        const canonical = new URL(path, "https://gocanto.sh").toString();

        this.capture(html, /<title>([^<]+)<\/title>/, path, "title");
        this.capture(
            html,
            /<meta name="description" content="([^"]+)"\s*\/?>/,
            path,
            "description",
        );

        this.assertCount(html, /<h1(?:\s|>)/g, 1, path, "H1");
        this.assertCount(html, /<link rel="canonical"/g, 1, path, "canonical");
        this.assertCount(html, /<script type="application\/ld\+json">/g, 1, path, "JSON-LD");

        if (!html.includes(`href="${canonical}"`)) {
            throw new Error(`[seo-guard] ${path} does not self-canonicalize to ${canonical}`);
        }

        if (/@gmail\.com|\+65\s*8292|>References?</i.test(html)) {
            throw new Error(`[seo-guard] private CV contact or reference content found on ${path}`);
        }

        console.log("[seo-guard] verified the profile HTML route");
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
