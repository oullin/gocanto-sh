import { defineConfig } from "vitepress";
import { join } from "node:path";

import { WritingBundle } from "#writing/bundle";
import { RssFeed } from "#writing/rss";
import { WritingSeoHead } from "#writing/seo";

const SITE_URL = "https://writing.gocanto.sh";

const DESCRIPTION =
    "First-hand engineering field notes by Gustavo Ocanto on regulated systems, payments, banking modernisation, reliable delivery, and production AI.";

const rssFeed = new RssFeed({
    loadPosts: async () => {
        const { default: loader } = await import("#writing/posts-data");

        return loader.load();
    },
});

export default defineConfig({
    lang: "en-US",
    title: "Gustavo Ocanto: Writing",
    // Default is ":title | <title>", which renders the index as
    // "Writing | Gustavo Ocanto: Writing". Name the author once instead.
    titleTemplate: ":title | Gustavo Ocanto",
    description: DESCRIPTION,

    // The landing page (gocanto.sh) is dark-only; match it and drop the toggle.
    appearance: "force-dark",

    // Subdomain root; posts live in posts/ but resolve at clean top-level URLs.
    base: "/",
    cleanUrls: true,
    // README is package/deploy docs, not a published page.
    srcExclude: ["README.md"],
    rewrites: {
        "posts/:slug.md": ":slug.md",
    },

    lastUpdated: true,
    sitemap: {
        hostname: SITE_URL,
    },

    head: [
        ["link", { rel: "icon", href: "/favicon.png" }],
        [
            "link",
            {
                rel: "alternate",
                type: "application/rss+xml",
                title: "Gustavo Ocanto: Writing",
                href: `${SITE_URL}${RssFeed.PATH}`,
            },
        ],
        // Design fonts: IBM Plex Sans (body) + JetBrains Mono (chrome/code).
        ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
        ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
        [
            "link",
            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:ital,wght@0,400;0,500;1,400&display=swap",
            },
        ],
    ],

    transformHead({ pageData, description }) {
        return new WritingSeoHead({
            relativePath: pageData.relativePath,
            title: pageData.title,
            description,
            frontmatter: pageData.frontmatter,
        }).build();
    },

    themeConfig: {
        nav: [
            { text: "Writing", link: "/" },
            { text: "gocanto.sh", link: "https://gocanto.sh" },
        ],

        socialLinks: [
            { icon: "x", link: "https://x.com/gocanto" },
            { icon: "github", link: "https://github.com/gocanto" },
        ],

        outline: { level: [2, 3], label: "On this page" },

        footer: {
            message: "Written by Gustavo Ocanto.",
            copyright: "© " + new Date().getFullYear() + " Gustavo Ocanto",
        },

        search: {
            provider: "local",
            options: {
                translations: {
                    button: {
                        buttonText: "Search writing…",
                        buttonAriaLabel: "Search writing",
                    },
                },
            },
        },
    },

    vite: {
        plugins: [
            {
                name: "writing-rss",
                enforce: "pre",
                configureServer(server) {
                    server.middlewares.use((request, response, next) => {
                        void rssFeed.serve(request, response).then((handled) => {
                            if (!handled) {
                                next();
                            }
                        }, next);
                    });
                },
            },
        ],
    },

    async buildEnd(siteConfig) {
        const { default: loader } = await import("#writing/posts-data");

        const posts = await loader.load();

        await Promise.all([
            rssFeed.write(siteConfig.outDir),
            new WritingBundle(join(siteConfig.srcDir, "posts"), siteConfig.outDir).write(posts),
        ]);
    },
});
