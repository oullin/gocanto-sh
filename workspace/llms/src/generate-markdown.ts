import { bio, education, experience, links, profile, projects, talks } from "@gocanto/store";
import { recommendations } from "@gocanto/store/recommendations";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { MarkdownBundleWriter } from "#llms/bundle/bundle-writer";
import { NodeFileSystem } from "#llms/kernel/node-file-system";

const __dirname = dirname(
    fileURLToPath(import.meta.url),
);

const distDir = resolve(__dirname, "../../app/dist");

const { files, lastmod } = new MarkdownBundleWriter(new NodeFileSystem()).generate(distDir, {
    profile,
    bio,
    projects,
    experience,
    education,
    recommendations,
    talks,
    links,
});

const markdownCount = files.filter((file) => file.endsWith(".md")).length;

console.log(
    `[llms] wrote ${markdownCount} markdown files, llms.txt, and sitemap.xml (lastmod=${lastmod}) into ${distDir}`,
);
