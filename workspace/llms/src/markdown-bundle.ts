import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { BioFormatter } from "#llms/bio-formatter";
import {
    formatAll,
    formatEducation,
    formatExperience,
    formatLinks,
    formatProfile,
    formatProjects,
    formatRecommendations,
    formatTalks,
    type AllFixtures,
} from "#llms/formatters";
import { renderLlmsTxt } from "#llms/llms-txt";
import { computeLastmod, renderSitemap } from "#llms/sitemap";

const SITE_URL = "https://gocanto.sh";

/** Builds and writes the complete machine-readable site bundle. */
export class MarkdownBundle {
    constructor(private readonly sources: AllFixtures) {}

    /** Returns every bundle filename and its newline-terminated contents. */
    files(): ReadonlyMap<string, string> {
        const files = new Map<string, string>();

        files.set("profile.md", this.withTrailingNewline(formatProfile(this.sources.profile)));
        files.set("bio.md", this.withTrailingNewline(new BioFormatter(this.sources.bio).format()));
        files.set(
            "experience.md",
            this.withTrailingNewline(formatExperience(this.sources.experience)),
        );
        files.set("projects.md", this.withTrailingNewline(formatProjects(this.sources.projects)));
        files.set("education.md", this.withTrailingNewline(formatEducation(this.sources.education)));
        files.set("talks.md", this.withTrailingNewline(formatTalks(this.sources.talks)));
        files.set(
            "recommendations.md",
            this.withTrailingNewline(formatRecommendations(this.sources.recommendations)),
        );
        files.set("links.md", this.withTrailingNewline(formatLinks(this.sources.links)));
        files.set("index.md", this.withTrailingNewline(formatAll(this.sources)));
        files.set(
            "llms.txt",
            this.withTrailingNewline(renderLlmsTxt(SITE_URL, this.sources.profile)),
        );

        const lastmod = computeLastmod({
            projects: this.sources.projects,
            experience: this.sources.experience,
            recommendations: this.sources.recommendations,
            talks: this.sources.talks,
        });

        files.set(
            "sitemap.xml",
            this.withTrailingNewline(renderSitemap(SITE_URL, lastmod)),
        );

        return files;
    }

    /** Writes the complete bundle into the supplied distribution directory. */
    writeTo(distDir: string): void {
        mkdirSync(distDir, { recursive: true });

        for (const [name, contents] of this.files()) {
            writeFileSync(resolve(distDir, name), contents, "utf8");
        }
    }

    private withTrailingNewline(contents: string): string {
        return contents.endsWith("\n") ? contents : `${contents}\n`;
    }
}
