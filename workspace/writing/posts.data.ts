import { createContentLoader } from "vitepress";

export interface Post {
    title: string;
    url: string;
    date: {
        raw: string;
        display: string;
    };
    description: string;
    tags: string[];
}

declare const data: Post[];
export { data };

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
});

function formatDate(raw: string): Post["date"] {
    const date = new Date(`${raw}T00:00:00Z`);

    return {
        raw,
        display: dateFormatter.format(date),
    };
}

export default createContentLoader("posts/*.md", {
    excerpt: true,
    transform(raw): Post[] {
        return raw
            .filter((page) => typeof page.frontmatter.date === "string")
            .map(({ url, frontmatter, excerpt }) => ({
                title: frontmatter.title ?? url,
                url,
                date: formatDate(frontmatter.date),
                description: frontmatter.description ?? excerpt ?? "",
                tags: frontmatter.tags ?? [],
            }))
            .sort((a, b) => +new Date(b.date.raw) - +new Date(a.date.raw));
    },
});
