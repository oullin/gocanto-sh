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

new MarkdownBundleWriter(new NodeFileSystem()).generate(distDir, {
    profile,
    bio,
    projects,
    experience,
    education,
    recommendations,
    talks,
    links,
});
