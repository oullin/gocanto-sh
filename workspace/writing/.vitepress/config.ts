import type { IncomingMessage, ServerResponse } from "node:http";

import { defineConfig } from "vitepress";

import { RssFeed } from "#writing/rss";

const SITE_URL = "https://writing.gocanto.sh";

const DESCRIPTION =
    "Engineering notes by Gustavo Ocanto: Go, Laravel, and the edge. Real code from shipped systems, not slop.";

const rssFeed = new RssFeed({
    loadPosts: async () => {
        const { default: loader } = await import("#writing/posts-data");

        return loader.load();
    },
});

function serveRssFeed(request: IncomingMessage, response: ServerResponse, next: (err?: any) => void) {
    void rssFeed.serve(request, response).then((handled) => {
        if (!handled) {
            next();
        }
    }, next);
}

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
        ["meta", { property: "og:type", content: "website" }],
        ["meta", { property: "og:site_name", content: "Gustavo Ocanto: Writing" }],
        ["meta", { property: "og:url", content: SITE_URL }],
        ["meta", { property: "og:image", content: `${SITE_URL}/og-image.png` }],
        ["meta", { name: "twitter:card", content: "summary_large_image" }],
        ["meta", { name: "twitter:site", content: "@gocanto" }],
        ["meta", { name: "twitter:creator", content: "@gocanto" }],
    ],

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
                    server.middlewares.use(serveRssFeed);
                },
            },
        ],
    },

    async buildEnd(siteConfig) {
        await rssFeed.write(siteConfig.outDir);
    },
});
