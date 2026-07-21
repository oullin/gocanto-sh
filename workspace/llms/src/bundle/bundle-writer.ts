import type { FileSystem } from "#llms/kernel/file-system";
import { SITE_URL } from "#llms/kernel/constants";
import { LlmsTxt } from "#llms/llms-txt/llms-txt";
import { FixtureMarkdown } from "#llms/markdown/formatter";
import type { AllFixtures } from "#llms/markdown/types";
import { Sitemap } from "#llms/sitemap/sitemap";

type GeneratedFile = {
    name: string;
    body: string;
};

/** Writes the complete static markdown, discovery, and sitemap bundle. */
export class MarkdownBundleWriter {
    /**
     * Creates a bundle writer.
     *
     * @param fs - Filesystem port used for all output operations.
     */
    public constructor(private readonly fs: FileSystem) {}

    /**
     * Generates every static LLM resource in the destination directory.
     *
     * @param distDir - Destination directory for generated resources.
     * @param fixtures - Complete fixture collection to render.
     * @returns Written filenames and the sitemap last-modified date.
     */
    public generate(distDir: string, fixtures: AllFixtures): { files: string[]; lastmod: string } {
        const lastmod = Sitemap.lastmod(fixtures);

        const generated: GeneratedFile[] = [
            { name: "profile.md", body: FixtureMarkdown.profile(fixtures.profile) },
            { name: "experience.md", body: FixtureMarkdown.experience(fixtures.experience) },
            { name: "projects.md", body: FixtureMarkdown.projects(fixtures.projects) },
            { name: "education.md", body: FixtureMarkdown.education(fixtures.education) },
            { name: "talks.md", body: FixtureMarkdown.talks(fixtures.talks) },
            {
                name: "recommendations.md",
                body: FixtureMarkdown.recommendations(fixtures.recommendations),
            },
            { name: "links.md", body: FixtureMarkdown.links(fixtures.links) },
            { name: "index.md", body: FixtureMarkdown.all(fixtures) },
            { name: "llms.txt", body: LlmsTxt.render(SITE_URL, fixtures.profile) },
            { name: "sitemap.xml", body: Sitemap.render(SITE_URL, lastmod) },
        ];

        this.fs.ensureDir(distDir);

        for (const file of generated) {
            this.fs.writeFile(
                `${distDir}/${file.name}`,
                file.body.endsWith("\n") ? file.body : `${file.body}\n`,
            );
        }

        return {
            files: generated.map((file) => file.name),
            lastmod,
        };
    }
}
