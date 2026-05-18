<script setup lang="ts">
import { ref } from "vue";
import { experience } from "@gocanto/store";
import { useInViewReady } from "@lib/useAsyncInView";

type Guide = {
    title: string;
    excerpt: string;
    tags: { label: string; color: string }[];
};

const PLACEHOLDER_COUNT = 6;

const section = ref<HTMLElement | null>(null);

const tagColorFor = (t: string) => {
    if (t === "Contract") {
        return "purple";
    }

    if (t === "Contractor") {
        return "amber";
    }

    if (t === "Full-Time") {
        return "blue";
    }

    return "green";
};

const guides: Guide[] = experience.data.slice(0, PLACEHOLDER_COUNT).map((e) => ({
    title: `${e.position} · ${e.company}`,
    excerpt: e.summary
        .replace(/<br\s*\/?>/g, " ")
        .replace(/\s+/g, " ")
        .slice(0, 180)
        .trim(),
    tags: [
        { label: e.employment_type, color: tagColorFor(e.employment_type) },
        { label: e.country, color: "green" },
    ],
}));

const ready = useInViewReady(section);
</script>

<template>
    <section id="work" ref="section">
        <div class="sect-head">
            <div>
                <span class="kicker">Proof · Where I've done it</span>
                <h2>Featured Work</h2>
            </div>
            <div class="sub">
                Six roles, twenty years. From freelance web work in the US to leading the team
                behind a regional core banking platform.
            </div>
        </div>

        <div class="guides-grid guides-grid--contained">
            <div v-for="g in guides" :key="g.title" class="guide-card" :aria-busy="!ready">
                <div>
                    <h3>
                        <span :class="{ 'sk-shimmer': !ready }">{{ g.title }}</span>
                    </h3>
                    <p>
                        <span :class="{ 'sk-shimmer': !ready }">{{ g.excerpt }}...</span>
                    </p>
                </div>
                <div class="guide-tags">
                    <span
                        v-for="t in g.tags"
                        :key="t.label"
                        class="pill"
                        :class="ready ? t.color : 'sk-shimmer-pill'"
                    >
                        {{ t.label }}
                    </span>
                </div>
            </div>
        </div>
    </section>
</template>
