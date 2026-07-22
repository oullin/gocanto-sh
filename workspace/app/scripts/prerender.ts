import { build } from "vite";
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

import { bio, links, profile } from "@gocanto/store";
import { PrerenderInjector } from "#app/lib/prerender-injector";
import { PageMetadataInjector } from "#app/lib/page-metadata";
import { StructuredDataBuilder } from "#app/lib/structured-data";

const __dirname = dirname(
    fileURLToPath(import.meta.url),
);

const appRoot = resolve(__dirname, "..");
const ssrOutDir = resolve(appRoot, ".prerender-ssr");
const ssrEntryFile = "entry-server.js";
const distIndex = resolve(appRoot, "dist/index.html");
const rootTitle = "Gustavo Ocanto — Software Architect for Regulated Systems";
const rootDescription = bio.data.summary;

console.log("[prerender] building SSR bundle…");

await build(
    {
        root: appRoot,
        configLoader: "runner",
        logLevel: "warn",
        ssr: {
            external: ["jsdom"],
        },
        build: {
            ssr: "src/entry-server.ts",
            outDir: ssrOutDir,
            emptyOutDir: true,
            rollupOptions: {
                input: resolve(appRoot, "src/entry-server.ts"),
                output: { entryFileNames: ssrEntryFile },
            },
        },
    },
);

console.log("[prerender] rendering App to HTML…");

const ssrBundleUrl = pathToFileURL(
    resolve(ssrOutDir, ssrEntryFile),
).href;

const { render } = (await import(ssrBundleUrl)) as {
    render: (path?: string) => Promise<string>;
};

const template = await readFile(distIndex, "utf8");

console.log("[prerender] rendering the profile route…");

const appHtml = await render();

const completed = new PageMetadataInjector(new PrerenderInjector(template).inject(appHtml)).inject({
    path: "/",
    title: rootTitle,
    description: rootDescription,
    type: "profile",
    image: "https://gocanto.sh/og-image.png",
    structuredData: new StructuredDataBuilder({ profile, links }).toScriptContents(),
});

await mkdir(
    dirname(distIndex),
    { recursive: true },
);

await writeFile(distIndex, completed);

console.log(`[prerender] / -> ${distIndex.replace(`${appRoot}/`, "")}`);

await rm(
    ssrOutDir,
    { recursive: true, force: true },
);

console.log(`[prerender] completed 1 route (${appHtml.length} bytes of app HTML)`);
