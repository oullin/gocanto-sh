<script setup lang="ts">
import { links, profile } from "@gocanto/data";
import { Heart } from "lucide-vue-next";
import ThemeToggle from "@components/ThemeToggle.vue";

type FooterLink = {
    readonly label: string;
    readonly href: string;
    readonly external?: boolean;
};

const social = Object.fromEntries(
    links.data.map((l) => [l.name, l]),
);
const githubPersonalUrl = social.github?.url ?? "#";
const githubOullinUrl = social.github_oullin?.url ?? "#";
const linkedinUrl = social.linkedin?.url ?? "#";
const xUrl = social.x?.url ?? "#";
const mailto = `mailto:${profile.data.email}`;
const year = new Date().getFullYear();
const ownerName = profile.data.name;

const columns: ReadonlyArray<{ heading: string; links: readonly FooterLink[] }> = [
    {
        heading: "Work",
        links: [
            { label: "Featured work", href: "#work" },
            { label: "Projects", href: "#work" },
            { label: "About", href: "#about" },
        ],
    },
    {
        heading: "Open Source",
        links: [
            { label: "GitHub · gocanto", href: githubPersonalUrl, external: true },
            { label: "GitHub · oullin", href: githubOullinUrl, external: true },
        ],
    },
    {
        heading: "Connect",
        links: [
            { label: "Email", href: mailto },
            { label: "LinkedIn", href: linkedinUrl, external: true },
            { label: "X", href: xUrl, external: true },
        ],
    },
];
</script>

<template>
    <footer class="footer">
        <div class="footer-top">
            <div v-for="col in columns" :key="col.heading" class="footer-col">
                <h4>{{ col.heading }}</h4>
                <ul>
                    <li v-for="link in col.links" :key="`${col.heading}-${link.label}`">
                        <a
                            :href="link.href"
                            :target="link.external ? '_blank' : undefined"
                            :rel="link.external ? 'noopener noreferrer' : undefined"
                        >{{ link.label }}</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <span class="status">
                <Heart :size="14" :stroke-width="1.75" aria-hidden="true" class="status-icon" />
                <span>Husband, Father, Brother, and Son</span>
            </span>
            <div class="footer-socials">
                <span>© {{ year }} {{ ownerName }}</span>
                <ThemeToggle />
            </div>
        </div>
    </footer>
</template>
