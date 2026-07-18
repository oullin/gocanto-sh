import { defineConfig } from "vitepress";

const SITE_URL = "https://writing.gocanto.sh";
const DESCRIPTION = "Engineering notes by Gustavo Ocanto — Go, Laravel, and the edge. Real code from shipped systems, not slop.";

export default defineConfig({
    lang: "en-US",
    title: "Gustavo Ocanto — Writing",
    description: DESCRIPTION,

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
        ["meta", { property: "og:type", content: "website" }],
        ["meta", { property: "og:site_name", content: "Gustavo Ocanto — Writing" }],
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
        },
    },
});
