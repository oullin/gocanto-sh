<script setup lang="ts">
import { links, profile } from "@gocanto/store";
import ThemeToggle from "@components/ThemeToggle.vue";

const social = Object.fromEntries(links.data.map((l) => [l.name, l]));
const githubPersonalUrl = social.github?.url ?? "#";
const githubOullinUrl = social.github_oullin?.url ?? "#";
const linkedinUrl = social.linkedin?.url ?? "#";
const xUrl = social.x?.url ?? "#";
const mailto = `mailto:${profile.data.email}`;
const year = new Date().getFullYear();
const ownerName = profile.data.name;
</script>

<template>
    <footer class="footer">
        <div class="foot-inner">
            <div class="foot-brand">
                <div class="name">{{ ownerName }}</div>
                <div class="where">Software engineer · Singapore</div>
                <div class="foot-extras">
                    <span class="foot-extras__label">Theme</span>
                    <ThemeToggle />
                </div>
                <div class="copyright">
                    © {{ year }} {{ ownerName }} · MIT for code, all rights reserved for personal
                    content.
                </div>
            </div>
            <div class="foot-col">
                <h6>Work</h6>
                <a href="#work">Featured work</a>
                <a href="#projects">Projects</a>
                <a href="#about">About</a>
            </div>
            <div class="foot-col">
                <h6>Open source</h6>
                <a :href="githubPersonalUrl" target="_blank" rel="noopener noreferrer"
                    >GitHub · gocanto</a
                >
                <a :href="githubOullinUrl" target="_blank" rel="noopener noreferrer"
                    >GitHub · oullin</a
                >
            </div>
            <div class="foot-col">
                <h6>Connect</h6>
                <a :href="mailto">Email</a>
                <a :href="linkedinUrl" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a :href="xUrl" target="_blank" rel="noopener noreferrer">X</a>
            </div>
        </div>
    </footer>
</template>
