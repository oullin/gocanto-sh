import { build } from "vite";
import { readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(__dirname, "..");
const ssrOutDir = resolve(appRoot, ".prerender-ssr");
const ssrEntryFile = "entry-server.js";
const distIndex = resolve(appRoot, "dist/index.html");

console.log("[prerender] building SSR bundle…");
await build({
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
});

console.log("[prerender] rendering App to HTML…");
const ssrBundleUrl = pathToFileURL(resolve(ssrOutDir, ssrEntryFile)).href;
const { render } = (await import(ssrBundleUrl)) as { render: () => Promise<string> };
const appHtml = await render();

console.log("[prerender] injecting into dist/index.html…");
const template = await readFile(distIndex, "utf8");
const appStart = template.indexOf('<div id="app">');
const bodyEnd = template.lastIndexOf("</body>");
const appEnd = bodyEnd > appStart ? template.lastIndexOf("</div>", bodyEnd) : -1;

if (appStart === -1 || appEnd === -1) {
    throw new Error('[prerender] could not locate <div id="app"> in dist/index.html');
}

const injected = `${template.slice(0, appStart)}<div id="app">${appHtml}</div>${template.slice(
    appEnd + "</div>".length,
)}`;

await writeFile(distIndex, injected);
await rm(ssrOutDir, { recursive: true, force: true });

console.log(`[prerender] dist/index.html prerendered (${appHtml.length} bytes of app HTML)`);
