<script setup lang="ts">
import { ref } from "vue";
import { experience } from "@gocanto/store";
import type { ExperienceRecord } from "@gocanto/store";
import { useInViewReady } from "@lib/useAsyncInView";

type Job = {
    role: string;
    co: string;
    yrs: string;
    body: string;
    tags: { label: string; color: string }[];
};

const section = ref<HTMLElement | null>(null);

const BODY_MAX = 280;

const stripHtml = (s: string): string =>
    s
        .replace(/<br\s*\/?\s*>/gi, " ")
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();

const employmentColor = (t: string): string => {
    if (t === "Contract") {
        return "amber";
    }
    if (t === "Contractor") {
        return "rose";
    }
    if (t === "Full-Time") {
        return "green";
    }
    return "violet";
};

const truncate = (text: string, max: number): string => {
    if (text.length <= max) {
        return text;
    }
    const slice = text.slice(0, max);
    const lastSpace = slice.lastIndexOf(" ");
    return `${slice.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
};

const formatRange = (start: string, end: string): string => {
    if (!end || end.toLowerCase() === "present") {
        return `Since ${start}`;
    }
    return `${start} – ${end}`;
};

const toJob = (e: ExperienceRecord): Job => ({
    role: `${e.position} · ${e.company}`,
    co: e.city ? `${e.city}, ${e.country}` : e.country,
    yrs: formatRange(e.start_date, e.end_date),
    body: truncate(stripHtml(e.summary), BODY_MAX),
    tags: [
        { label: e.employment_type, color: employmentColor(e.employment_type) },
        { label: e.country, color: e.country === "Venezuela" ? "violet" : "blue" },
    ],
});

const jobs: Job[] = experience.data.slice(0, 6).map(toJob);

const ready = useInViewReady(section);
</script>

<template>
    <section id="work" ref="section">
        <div class="sect-head">
            <div>
                <span class="kicker">Proof · Where I've done it</span>
                <h2>Featured work.</h2>
            </div>
            <div class="sub">
                Six roles, twenty years. From freelance web work in the US to leading the team behind
                a regional core banking platform.
            </div>
        </div>

        <div class="work-grid">
            <article v-for="j in jobs" :key="j.role" class="job" :aria-busy="!ready">
                <h3 class="job-role">
                    <span :class="{ 'sk-shimmer': !ready }">{{ j.role }}</span>
                </h3>
                <div class="job-co">
                    <span :class="{ 'sk-shimmer': !ready }">{{ j.co }}. </span>
                    <span class="yrs"><span :class="{ 'sk-shimmer': !ready }">{{ j.yrs }}</span></span>
                </div>
                <p class="job-body">
                    <span :class="{ 'sk-shimmer': !ready }">{{ j.body }}</span>
                </p>
                <div class="job-tags">
                    <span
                        v-for="t in j.tags"
                        :key="t.label"
                        class="tag"
                        :class="ready ? t.color : 'sk-shimmer-pill'"
                    >
                        {{ t.label }}
                    </span>
                </div>
            </article>
        </div>
    </section>
</template>
