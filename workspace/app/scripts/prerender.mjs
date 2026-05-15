import { build } from "vite";
import { readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(__dirname, "..");
const ssrOutDir = resolve(appRoot, ".prerender-ssr");
const distIndex = resolve(appRoot, "dist/index.html");

console.log("[prerender] building SSR bundle…");
await build({
    root: appRoot,
    configLoader: "runner",
    logLevel: "warn",
    build: {
        ssr: "src/entry-server.ts",
        outDir: ssrOutDir,
        emptyOutDir: true,
        rollupOptions: {
            input: resolve(appRoot, "src/entry-server.ts"),
            output: { entryFileNames: "entry-server.mjs" },
        },
    },
});

console.log("[prerender] rendering App to HTML…");
const { render } = await import(pathToFileURL(resolve(ssrOutDir, "entry-server.mjs")).href);
const appHtml = await render();

console.log("[prerender] injecting into dist/index.html…");
const template = await readFile(distIndex, "utf8");
const injected = template.replace(
    /<div id="app">[\s\S]*?<\/div>(?=\s*<\/body>)/,
    `<div id="app">${appHtml}</div>`,
);

if (injected === template) {
    throw new Error("[prerender] could not locate <div id=\"app\"> in dist/index.html");
}

await writeFile(distIndex, injected);
await rm(ssrOutDir, { recursive: true, force: true });

console.log("[prerender] dist/index.html prerendered (" + appHtml.length + " bytes of app HTML)");
