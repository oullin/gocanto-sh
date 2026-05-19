import { education, experience, links, profile, projects, talks } from "@gocanto/store";
import { recommendations } from "@gocanto/store/recommendations";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import {
    formatAll,
    formatEducation,
    formatExperience,
    formatLinks,
    formatProfile,
    formatProjects,
    formatRecommendations,
    formatTalks,
} from "./formatters.ts";
import { renderLlmsTxt } from "./llms-txt.ts";
import { computeLastmod, renderSitemap } from "./sitemap.ts";

const SITE_URL = "https://gocanto.sh";
const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../../app/dist");

mkdirSync(distDir, { recursive: true });

const write = (name: string, body: string): void => {
    const out = body.endsWith("\n") ? body : `${body}\n`;

    writeFileSync(resolve(distDir, name), out, "utf8");
};

write("profile.md", formatProfile(profile));
write("experience.md", formatExperience(experience));
write("projects.md", formatProjects(projects));
write("education.md", formatEducation(education));
write("talks.md", formatTalks(talks));
write("recommendations.md", formatRecommendations(recommendations));
write("links.md", formatLinks(links));

write(
    "index.md",
    formatAll({
        profile,
        projects,
        experience,
        education,
        recommendations,
        talks,
        links,
    }),
);

write("llms.txt", renderLlmsTxt(SITE_URL, profile));

const lastmod = computeLastmod({
    projects,
    experience,
    recommendations,
    talks,
});

write("sitemap.xml", renderSitemap(SITE_URL, lastmod));

console.log(
    `[llms] wrote 8 markdown files, llms.txt, and sitemap.xml (lastmod=${lastmod}) into ${distDir}`,
);
