import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** A built site and the directory it is published under in the combined output. */
interface Site {
    /** Label used in the build log. */
    readonly name: string;
    /** Build output to copy from, relative to the repo root. */
    readonly source: string;
    /** Directory to publish under inside the combined output. */
    readonly mount: string;
}

/**
 * Assembles both built sites into one Vercel output directory.
 *
 * Vercel gives the filesystem precedence over rewrites, so neither site can sit
 * at the output root: a request for `/assets/app.js` on either host would be
 * served by whichever site owned the root before the host rewrite ran. Mounting
 * both under their own directory leaves the root empty, so the host rewrites in
 * `vercel.json` always decide which site answers.
 */
class DistAssembler {
    private static readonly sites: readonly Site[] = [
        { name: "app", source: "workspace/app/dist", mount: "app" },
        { name: "writing", source: "workspace/writing/.vitepress/dist", mount: "writing" },
    ];

    constructor(
        private readonly root: string,
        private readonly outDir: string,
    ) {}

    static create(): DistAssembler {
        const root = resolve(
            dirname(
                fileURLToPath(import.meta.url),
            ),
            "../..",
        );

        return new DistAssembler(root, join(root, "dist"));
    }

    async run(): Promise<void> {
        this.assertSourcesBuilt();

        await rm(
            this.outDir,
            { recursive: true, force: true },
        );

        await mkdir(
            this.outDir,
            { recursive: true },
        );

        await Promise.all(DistAssembler.sites.map(async (site) => {
            await cp(
                join(this.root, site.source),
                join(this.outDir, site.mount),
                {
                    recursive: true,
                },
            );

            console.log(`assembled ${site.name} -> dist/${site.mount}`);
        }));

        await this.assertRootIsEmpty();
    }

    /**
     * The host rewrites only decide the site when nothing answers at the output
     * root, because Vercel resolves the filesystem before rewrites. A stray file
     * here would be served on both hosts and quietly shadow one of them, so the
     * build fails rather than shipping it.
     */
    private async assertRootIsEmpty(): Promise<void> {
        const mounts = DistAssembler.sites.map((site) => site.mount);

        const entries = await readdir(this.outDir);

        const strays = entries.filter((entry) => !mounts.includes(entry));

        if (strays.length > 0) {
            throw new Error(
                `dist/ root must contain only ${mounts.join(", ")}; found ${strays.join(", ")}. ` +
                    "Files at the root are served before the host rewrites run.",
            );
        }
    }

    /**
     * Fail loudly when a site was not built. Copying a missing directory would
     * otherwise publish a deployment that silently 404s on one of the hosts.
     */
    private assertSourcesBuilt(): void {
        const missing = DistAssembler.sites
            .filter((site) => !existsSync(
                join(this.root, site.source),
            ))
            .map((site) => site.source);

        if (missing.length > 0) {
            throw new Error(`missing build output: ${missing.join(", ")}. Run the build first.`);
        }
    }
}

DistAssembler.create()
    .run()
    .catch((error: unknown) => {
        console.error(error);
        process.exitCode = 1;
    });
