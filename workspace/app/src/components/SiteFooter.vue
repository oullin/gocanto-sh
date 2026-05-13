<script setup lang="ts">
import { links, profile } from "@gocanto/data";
import ThemeToggle from "@components/ThemeToggle.vue";

const social = Object.fromEntries(
    links.data.map((l) => [l.name, l]),
);
const githubUrl = social.github?.url ?? "#";
const linkedinUrl = social.linkedin?.url ?? "#";
const mailto = `mailto:${profile.data.email}`;
const year = new Date().getFullYear();
const ownerName = profile.data.name;

const columns = [
    {
        heading: "Get started",
        links: ["Latest", "Featured", "Topics", "Archives"],
    },
    {
        heading: "Build",
        links: ["Backend", "Frontend", "Tooling", "DX"],
    },
    {
        heading: "Scale",
        links: ["Observability", "Infrastructure", "Performance", "Cost"],
    },
    {
        heading: "Secure",
        links: ["AppSec", "Secrets", "Supply chain", "Auth"],
    },
    {
        heading: "Resources",
        links: ["Talks", "Open source", "Reading list", "Press kit"],
    },
    {
        heading: "Learn",
        links: ["Notes", "Case studies", "Changelog", "Glossary"],
    },
];
</script>

<template>
    <footer class="footer">
        <div class="footer-top">
            <div v-for="col in columns" :key="col.heading" class="footer-col">
                <h4>{{ col.heading }}</h4>
                <ul>
                    <li v-for="link in col.links" :key="link">
                        <a href="#">{{ link }}</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <span class="status">All systems normal</span>
            <div class="footer-socials">
                <a :href="githubUrl" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a :href="linkedinUrl" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a :href="mailto">Email</a>
                <span>© {{ year }} {{ ownerName }}</span>
                <ThemeToggle />
            </div>
        </div>
    </footer>
</template>
