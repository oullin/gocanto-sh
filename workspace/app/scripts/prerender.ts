import { build } from "vite";
import { readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

import { links, profile } from "@gocanto/store";
import { PrerenderInjector } from "#app/lib/prerender-injector";
import { StructuredDataBuilder } from "#app/lib/structured-data";

const __dirname = dirname(
	fileURLToPath(import.meta.url),
);

const appRoot = resolve(__dirname, "..");
const ssrOutDir = resolve(appRoot, ".prerender-ssr");
const ssrEntryFile = "entry-server.js";
const distIndex = resolve(appRoot, "dist/index.html");
const jsonLdMarker = "<!--__JSONLD__-->";

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

const { render } = (await import(ssrBundleUrl)) as { render: () => Promise<string> };

const appHtml = await render();

console.log("[prerender] injecting into dist/index.html…");

const template = await readFile(distIndex, "utf8");

const injected = new PrerenderInjector(template).inject(appHtml);
const structuredData = new StructuredDataBuilder({ profile, links }).toScriptContents();

if (!injected.includes(jsonLdMarker)) {
    throw new Error("[prerender] could not locate JSON-LD marker in dist/index.html");
}

const completed = injected.replace(jsonLdMarker, () => structuredData);

await writeFile(distIndex, completed);

await rm(
	ssrOutDir,
	{ recursive: true, force: true },
);

console.log(`[prerender] dist/index.html prerendered (${appHtml.length} bytes of app HTML)`);
