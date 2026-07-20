import { bio, education, experience, links, profile, projects, talks } from "@gocanto/store";
import { recommendations } from "@gocanto/store/recommendations";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { MarkdownBundle } from "#llms/markdown-bundle";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../../app/dist");
const bundle = new MarkdownBundle({
    profile,
    bio,
    projects,
    experience,
    education,
    recommendations,
    talks,
    links,
});

const files = bundle.files();

bundle.writeTo(distDir);

console.log(`[llms] wrote ${files.size} files into ${distDir}`);
