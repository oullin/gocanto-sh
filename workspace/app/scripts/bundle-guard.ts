import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

/** Detects server-only DOM dependencies that leak into browser bundles. */
class BundleGuard {
    private static readonly forbiddenStrings = ["jsdom", "JSDOM"] as const;
    private static readonly safeVueUserAgentProbe = /\.userAgent\)\?\.includes\([`"']jsdom[`"']\)/g;

    private constructor() {}

    /**
     * Reports whether an asset's contents contain a forbidden server-only DOM marker.
     *
     * The benign Vue jsdom user-agent probe is stripped first (globally, so repeated
     * occurrences do not leak through) to avoid false positives.
     *
     * @param contents - The emitted JavaScript asset contents to scan.
     * @returns `true` when a forbidden marker remains after stripping safe probes.
     */
    private static containsForbiddenMarker(contents: string): boolean {
        const contentsWithoutSafeProbe = contents.replace(BundleGuard.safeVueUserAgentProbe, "");

        return BundleGuard.forbiddenStrings.some((marker) =>
            contentsWithoutSafeProbe.includes(marker),
        );
    }

    /**
     * Scans emitted JavaScript assets and fails when server-only DOM markers are present.
     *
     * @throws When any emitted JavaScript asset contains a forbidden marker.
     */
    static async assertClean(): Promise<void> {
        const assetsDirectory = fileURLToPath(new URL("../dist/assets/", import.meta.url));
        const entries = await readdir(assetsDirectory, { withFileTypes: true });
        const javascriptFiles = entries
            .filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
            .map((entry) => entry.name)
            .sort();
        const offendingFiles = (
            await Promise.all(
                javascriptFiles.map(async (file) => {
                    const contents = await readFile(
                        new URL(`../dist/assets/${file}`, import.meta.url),
                        "utf8",
                    );

                    return BundleGuard.containsForbiddenMarker(contents) ? file : undefined;
                }),
            )
        ).filter((file): file is string => file !== undefined);

        if (offendingFiles.length > 0) {
            throw new Error(
                `[bundle-guard] server-only DOM dependency markers found:\n${offendingFiles.map((file) => `- ${file}`).join("\n")}`,
            );
        }

        console.log(`[bundle-guard] checked ${javascriptFiles.length} JavaScript assets`);
    }
}

await BundleGuard.assertClean();
