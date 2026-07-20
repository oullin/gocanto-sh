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

const isoDate = (input: string): string | null => {
    const parsed = new Date(input);

    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return parsed.toISOString().slice(0, 10);
};

export type LastmodSources = {
    projects: ProjectsFixture;
    experience: ExperienceFixture;
    recommendations: RecommendationsFixture;
    talks: TalksFixture;
};

export const computeLastmod = (sources: LastmodSources): string => {
    const candidates: string[] = [];

    for (const project of sources.projects.data) {
        const iso = isoDate(project.published_at);

        if (iso) {
            candidates.push(iso);
        }
    }

    for (const rec of sources.recommendations.data) {
        const iso = isoDate(rec.updated_at);

        if (iso) {
            candidates.push(iso);
        }
    }

    for (const talk of sources.talks.data) {
        const iso = isoDate(talk.updated_at);

        if (iso) {
            candidates.push(iso);
        }
    }

    if (candidates.length === 0) {
        return new Date().toISOString().slice(0, 10);
    }

    candidates.sort();

    return candidates[candidates.length - 1]!;
};

type Url = {
    loc: string;
    priority: string;
    changefreq: string;
};

export const renderSitemap = (siteUrl: string, lastmod: string): string => {
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
};
