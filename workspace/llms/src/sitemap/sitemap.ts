import type {
    ExperienceFixture,
    ProjectsFixture,
    RecommendationsFixture,
    TalksFixture,
} from "@gocanto/store";

const MD_PAGES = [
    "index.md",
    "profile.md",
    "experience.md",
    "projects.md",
    "education.md",
    "talks.md",
    "recommendations.md",
    "links.md",
] as const;

/** Groups the dated fixtures used to compute the sitemap last-modified value. */
export type LastmodSources = {
    projects: ProjectsFixture;
    experience: ExperienceFixture;
    recommendations: RecommendationsFixture;
    talks: TalksFixture;
};

type Url = {
    loc: string;
    priority: string;
    changefreq: string;
};

/** Computes metadata and renders the sitemap for generated LLM resources. */
export class Sitemap {
    private constructor() {}

    /**
     * Computes the latest valid content date across sitemap sources.
     *
     * @param sources - Fixture sources containing dated records.
     * @returns The latest date in YYYY-MM-DD format, or today when none are valid.
     */
    public static lastmod(sources: LastmodSources): string {
        const candidates: string[] = [];

        for (const project of sources.projects.data) {
            const iso = Sitemap.isoDate(project.published_at);

            if (iso) {
                candidates.push(iso);
            }
        }

        for (const rec of sources.recommendations.data) {
            const iso = Sitemap.isoDate(rec.updated_at);

            if (iso) {
                candidates.push(iso);
            }
        }

        for (const talk of sources.talks.data) {
            const iso = Sitemap.isoDate(talk.updated_at);

            if (iso) {
                candidates.push(iso);
            }
        }

        candidates.sort();

        return candidates.at(-1) ?? new Date().toISOString().slice(0, 10);
    }

    /**
     * Renders the sitemap XML document.
     *
     * @param siteUrl - Canonical site URL without a trailing slash.
     * @param lastmod - Last-modified date applied to every sitemap entry.
     * @returns Complete sitemap XML contents.
     */
    public static render(siteUrl: string, lastmod: string): string {
        const urls: Url[] = [
            { loc: `${siteUrl}/`, priority: "1.0", changefreq: "monthly" },
            ...MD_PAGES.map((page) => ({
                loc: `${siteUrl}/${page}`,
                priority: "0.7",
                changefreq: "monthly",
            })),
            { loc: `${siteUrl}/llms.txt`, priority: "0.5", changefreq: "monthly" },
        ];

        const body = urls
            .map(
                (u) =>
                    `    <url>\n        <loc>${u.loc}</loc>\n        <lastmod>${lastmod}</lastmod>\n        <changefreq>${u.changefreq}</changefreq>\n        <priority>${u.priority}</priority>\n    </url>`,
            )
            .join("\n");

        return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
    }

    private static isoDate(input: string): string | null {
        const parsed = new Date(input);

        if (Number.isNaN(parsed.getTime())) {
            return null;
        }

        return parsed.toISOString().slice(0, 10);
    }
}
