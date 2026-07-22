import { build } from "vite";
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

import { links, profile } from "@gocanto/store";
import { PrerenderInjector } from "#app/lib/prerender-injector";
import { AppPageRegistry } from "#app/lib/page-registry";
import { AuthorityStructuredDataBuilder, PageMetadataInjector } from "#app/lib/page-metadata";
import { StructuredDataBuilder } from "#app/lib/structured-data";

const __dirname = dirname(
    fileURLToPath(import.meta.url),
);

const appRoot = resolve(__dirname, "..");
const ssrOutDir = resolve(appRoot, ".prerender-ssr");
const ssrEntryFile = "entry-server.js";
const distIndex = resolve(appRoot, "dist/index.html");
const rootTitle = "Gustavo Ocanto — Software Architect for Regulated Systems";

const rootDescription =
    "Gustavo Ocanto is a Singapore-based software architect and principal engineer with 20+ years building regulated systems across banking, payments, e-commerce, and production AI.";

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

const rootStructuredData = new StructuredDataBuilder({ profile, links }).toScriptContents();
const routes = AppPageRegistry.all();

let renderedBytes = 0;

console.log(`[prerender] rendering ${routes.length + 1} routes…`);

for (const route of [undefined, ...routes]) {
    const path = route?.path ?? "/";

    const appHtml = await render(path);

    const injected = new PrerenderInjector(template).inject(appHtml);

    const metadata = route
        ? {
              path: route.path,
              title: route.title,
              description: route.description,
              type: "website" as const,
              image: "https://gocanto.sh/og-image.png",
              structuredData: new AuthorityStructuredDataBuilder(route).toScriptContents(),
          }
        : {
              path: "/",
              title: rootTitle,
              description: rootDescription,
              type: "profile" as const,
              image: "https://gocanto.sh/og-image.png",
              structuredData: rootStructuredData,
          };

    const completed = new PageMetadataInjector(injected).inject(metadata);
    const output = route ? resolve(appRoot, `dist/${route.path.slice(1)}.html`) : distIndex;

    await mkdir(
        dirname(output),
        { recursive: true },
    );

    await writeFile(output, completed);

    renderedBytes += appHtml.length;
    console.log(`[prerender] ${path} -> ${output.replace(`${appRoot}/`, "")}`);
}

await rm(
    ssrOutDir,
    { recursive: true, force: true },
);

console.log(
    `[prerender] completed ${routes.length + 1} routes (${renderedBytes} bytes of app HTML)`,
);
