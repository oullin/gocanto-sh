import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** An inline `<script>` found in a built page. */
interface InlineScript {
    /** The full `<script ...>...</script>` tag, used for replacement. */
    readonly tag: string;
    /** Any attributes declared on the tag, e.g. ` id="check-mac-os"`. */
    readonly attrs: string;
    /** The script body. */
    readonly body: string;
}

const INLINE_SCRIPT = /<script((?![^>]*\bsrc=)[^>]*)>([\s\S]*?)<\/script>/g;

/** The body VitePress emits for `appearance: "force-dark"`. */
const FORCE_DARK = 'document.documentElement.classList.add("dark");';

/**
 * Moves VitePress's inline `<script>` blocks into files under `assets/`, so the
 * writing site can ship `script-src 'self'` instead of `'unsafe-inline'`.
 *
 * Hashing the inline scripts in the CSP instead would look stricter but is a
 * trap: one of them carries `__VP_HASH_MAP__`, whose contents change whenever a
 * post is added or edited, so a pinned hash would block the page on the next
 * publish. Externalising removes the moving part entirely.
 *
 * The pass fails the build if any inline script survives it. A VitePress upgrade
 * that changes this markup should break here, loudly, rather than in production
 * against a CSP that no longer matches.
 */
class InlineScriptExternalizer {
    private readonly distDir: string;

    constructor(distDir: string) {
        this.distDir = distDir;
    }

    static create(): InlineScriptExternalizer {
        const here = dirname(
            fileURLToPath(import.meta.url),
        );

        return new InlineScriptExternalizer(resolve(here, "../dist"));
    }

    async run(): Promise<void> {
        const pages = await this.htmlPages();

        if (pages.length === 0) {
            throw new Error(`no HTML found in ${this.distDir}. Run the VitePress build first.`);
        }

        const counts = await Promise.all(
            pages.map(page => this.rewritePage(page))
        );
        const extracted = counts.reduce((acc, count) => acc + count, 0);

        await this.assertNoInlineScripts(pages);

        console.log(
            `[writing] externalised ${extracted} inline scripts across ${pages.length} pages`,
        );
    }

    private async rewritePage(page: string): Promise<number> {
        const original = await readFile(page, "utf8");

        let html = original;
        let count = 0;

        const scripts = InlineScriptExternalizer.inlineScripts(original);

        const replacements = await Promise.all(
            scripts.map(async (script) => {
                // force-dark only ever adds a class; setting it on the element is
                // equivalent and saves a render-blocking request before first paint.
                if (script.body.trim() === FORCE_DARK) {
                    return { script, isDark: true, name: "" };
                }
                const name = await this.writeAsset(script.body);
                return { script, isDark: false, name };
            })
        );

        for (const { script, isDark, name } of replacements) {
            if (isDark) {
                html = InlineScriptExternalizer.markDark(html).replace(script.tag, "");
                count += 1;
                continue;
            }

            html = html.replace(
                script.tag,
                `<script${script.attrs} src="/assets/${name}"></script>`,
            );
            count += 1;
        }

        if (html !== original) {
            await writeFile(page, html);
        }

        return count;
    }

    /**
     * Writes the body to a content-addressed file. Every page carries the same
     * inline scripts, so identical bodies collapse onto one cacheable asset.
     */
    private async writeAsset(body: string): Promise<string> {
        const digest = createHash("sha256")
            .update(body)
            .digest("hex")
            .slice(0, 8);

        const name = `vp-inline.${digest}.js`;

        await writeFile(
            join(this.distDir, "assets", name),
            body,
        );

        return name;
    }

    private static markDark(html: string): string {
        if (/<html[^>]*\bclass="[^"]*\bdark\b/.test(html)) {
            return html;
        }

        return html.replace(/<html([^>]*)>/, '<html$1 class="dark">');
    }

    private static inlineScripts(html: string): InlineScript[] {
        return [...html.matchAll(INLINE_SCRIPT)].map((match) => ({
            tag: match[0],
            attrs: match[1] ?? "",
            body: match[2] ?? "",
        }));
    }

    private async assertNoInlineScripts(pages: string[]): Promise<void> {
        await Promise.all(
            pages.map(async (page) => {
                const html = await readFile(page, "utf8");

                const leftover = InlineScriptExternalizer.inlineScripts(html);

                if (leftover.length > 0) {
                    throw new Error(
                        `${page} still has ${leftover.length} inline script(s) after externalising. ` +
                            "The CSP for writing.gocanto.sh sets script-src 'self', which would block them.",
                    );
                }
            })
        );
    }

    private async htmlPages(): Promise<string[]> {
        const entries = await readdir(
            this.distDir,
            { recursive: true, withFileTypes: true },
        );

        return entries
            .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
            .map((entry) => join(entry.parentPath, entry.name));
    }
}

InlineScriptExternalizer.create()
    .run()
    .catch((error: unknown) => {
        console.error(error);
        process.exitCode = 1;
    });
