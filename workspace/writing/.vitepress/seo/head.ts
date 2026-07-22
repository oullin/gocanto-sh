import type { HeadConfig } from "vitepress";

export interface WritingSeoInput {
    readonly relativePath: string;
    readonly title: string;
    readonly description: string;
    readonly frontmatter: Record<string, unknown>;
}

/** Builds canonical social and structured metadata for every writing page. */
export class WritingSeoHead {
    private static readonly siteUrl = "https://writing.gocanto.sh";
    private static readonly profileUrl = "https://gocanto.sh/";
    private static readonly authorId = "https://gocanto.sh/#person";
    private static readonly defaultImage = `${WritingSeoHead.siteUrl}/og-image.png`;
    private readonly input: WritingSeoInput;

    public constructor(input: WritingSeoInput) {
        this.input = input;
    }

    public build(): HeadConfig[] {
        const canonical = this.canonicalUrl();
        const image = this.imageUrl();
        const article = !this.isIndex();
        const title = this.input.title;
        const description = this.input.description;

        const head: HeadConfig[] = [
            ["link", { rel: "canonical", href: canonical }],
            ["meta", { property: "og:type", content: article ? "article" : "website" }],
            ["meta", { property: "og:site_name", content: "Gustavo Ocanto: Writing" }],
            ["meta", { property: "og:url", content: canonical }],
            ["meta", { property: "og:title", content: title }],
            ["meta", { property: "og:description", content: description }],
            ["meta", { property: "og:image", content: image }],
            ["meta", { property: "og:image:alt", content: `${title} — Gustavo Ocanto` }],
            ["meta", { name: "twitter:card", content: "summary_large_image" }],
            ["meta", { name: "twitter:site", content: "@gocanto" }],
            ["meta", { name: "twitter:creator", content: "@gocanto" }],
            ["meta", { name: "twitter:title", content: title }],
            ["meta", { name: "twitter:description", content: description }],
            ["meta", { name: "twitter:image", content: image }],
        ];

        if (article) {
            const publishedAt = this.date("date");
            const modifiedAt = this.date("updated") ?? publishedAt;

            if (publishedAt) {
                head.push(["meta", { property: "article:published_time", content: publishedAt }]);
            }

            if (modifiedAt) {
                head.push(["meta", { property: "article:modified_time", content: modifiedAt }]);
            }

            head.push(["meta", { property: "article:author", content: WritingSeoHead.profileUrl }]);

            for (const tag of this.tags()) {
                head.push(["meta", { property: "article:tag", content: tag }]);
            }
        }

        head.push([
            "script",
            { type: "application/ld+json" },
            JSON.stringify(this.structuredData()).replaceAll("<", "\\u003c"),
        ]);

        return head;
    }

    private structuredData(): Record<string, unknown> {
        const author = {
            "@type": "Person",
            "@id": WritingSeoHead.authorId,
            name: "Gustavo Ocanto",
            url: WritingSeoHead.profileUrl,
        };

        if (this.isIndex()) {
            return {
                "@context": "https://schema.org",
                "@type": "Blog",
                "@id": `${WritingSeoHead.siteUrl}/#blog`,
                url: this.canonicalUrl(),
                name: this.input.title,
                description: this.input.description,
                author,
                publisher: author,
                inLanguage: "en-US",
            };
        }

        return {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "@id": `${this.canonicalUrl()}#article`,
            mainEntityOfPage: this.canonicalUrl(),
            url: this.canonicalUrl(),
            headline: this.input.title,
            description: this.input.description,
            image: this.imageUrl(),
            datePublished: this.date("date"),
            dateModified: this.date("updated") ?? this.date("date"),
            author,
            publisher: author,
            keywords: this.tags().join(", "),
            inLanguage: "en-US",
        };
    }

    private canonicalUrl(): string {
        if (this.isIndex()) {
            return `${WritingSeoHead.siteUrl}/`;
        }

        const path = this.input.relativePath
            .replace(/^posts\//, "")
            .replace(/(?:index)?\.md$/, "")
            .replace(/\/$/, "");

        return `${WritingSeoHead.siteUrl}/${path}`;
    }

    private isIndex(): boolean {
        return this.input.relativePath === "index.md";
    }

    private imageUrl(): string {
        const value = this.input.frontmatter.image;

        if (typeof value !== "string" || value.trim() === "") {
            return WritingSeoHead.defaultImage;
        }

        return new URL(value, `${WritingSeoHead.siteUrl}/`).toString();
    }

    private date(key: "date" | "updated"): string | undefined {
        const value = this.input.frontmatter[key];

        if (value instanceof Date && !Number.isNaN(value.getTime())) {
            return value.toISOString().slice(0, 10);
        }

        return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined;
    }

    private tags(): string[] {
        const value = this.input.frontmatter.tags;

        if (Array.isArray(value)) {
            return value.filter((tag): tag is string => typeof tag === "string");
        }

        return typeof value === "string" ? [value] : [];
    }
}
