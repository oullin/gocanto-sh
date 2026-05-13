<script setup lang="ts">
import { ref } from "vue";
import { experience } from "@gocanto/data";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncInView } from "@lib/useAsyncInView";

type Guide = {
    title: string;
    excerpt: string;
    tags: { label: string; color: string }[];
};

const PLACEHOLDER_COUNT = 6;
const placeholders: Guide[] = Array.from({ length: PLACEHOLDER_COUNT }, () => ({
    title: "",
    excerpt: "",
    tags: [],
}));

const section = ref<HTMLElement | null>(null);

const guides = useAsyncInView<Guide[]>(section, () => {
    const tagColorFor = (t: string) => {
        if (t === "Contract") {return "purple";}
        if (t === "Contractor") {return "amber";}
        if (t === "Full-Time") {return "blue";}
        return "green";
    };
    return experience.data.slice(0, PLACEHOLDER_COUNT).map((e) => ({
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
});
</script>

<template>
    <section ref="section" class="frame-section">
        <div class="guides-grid">
            <div class="guides-grid__title">
                <h2>Featured Work</h2>
            </div>
            <div class="guides-grid__filler" aria-hidden="true"></div>
            <div class="guides-grid__filler" aria-hidden="true"></div>
            <a
                v-for="(g, i) in (guides ?? placeholders)"
                :key="g.title || `sk-${i}`"
                :href="guides ? '#' : undefined"
                class="guide-card"
                :aria-busy="!guides"
            >
                <div>
                    <h3>
                        <template v-if="guides">{{ g.title }}</template>
                        <span v-else class="guide-skeleton">
                            <Skeleton class="h-[21px] w-3/4 mb-2" />
                            <Skeleton class="h-[21px] w-1/2" />
                        </span>
                    </h3>
                    <p>
                        <template v-if="guides">{{ g.excerpt }}…</template>
                        <span v-else class="guide-skeleton">
                            <Skeleton class="h-[13px] w-full mb-2" />
                            <Skeleton class="h-[13px] w-full mb-2" />
                            <Skeleton class="h-[13px] w-5/6 mb-2" />
                            <Skeleton class="h-[13px] w-2/3" />
                        </span>
                    </p>
                </div>
                <div class="guide-tags">
                    <template v-if="guides">
                        <span v-for="t in g.tags" :key="t.label" class="pill" :class="t.color">
                            {{ t.label }}
                        </span>
                    </template>
                    <template v-else>
                        <Skeleton class="h-6 w-16 rounded-full" />
                        <Skeleton class="h-6 w-20 rounded-full" />
                    </template>
                </div>
            </a>
        </div>
    </section>
</template>

<style scoped>
.guide-skeleton {
    display: block;
}
</style>
