<script setup lang="ts">
import { ref } from "vue";
import { profile } from "@gocanto/data";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncInView } from "@lib/useAsyncInView";

type Cell = { title: string; description: string };

const PLACEHOLDER_COUNT = 6;
const placeholders: Cell[] = Array.from({ length: PLACEHOLDER_COUNT }, () => ({
    title: "",
    description: "",
}));

const section = ref<HTMLElement | null>(null);

const cells = useAsyncInView<Cell[]>(section, () =>
    [...profile.data.skills]
        .filter((s) => s.percentage >= 90)
        .slice(0, PLACEHOLDER_COUNT)
        .map((s) => ({ title: s.item, description: s.description })),
);
</script>

<template>
    <section ref="section" class="frame-section">
        <div class="explore-head">
            <h2>Signature skills</h2>
            <p>The disciplines and tools I lean on across every engagement.</p>
        </div>
        <div class="explore-grid">
            <a
                v-for="(c, i) in (cells ?? placeholders)"
                :key="c.title || `sk-${i}`"
                :href="cells ? '#' : undefined"
                class="explore-card"
                :aria-busy="!cells"
            >
                <h3>
                    <template v-if="cells">{{ c.title }}</template>
                    <Skeleton v-else class="h-[14px] w-3/5 inline-block align-middle" />
                </h3>
                <p>
                    <template v-if="cells">{{ c.description }}</template>
                    <span v-else class="explore-skeleton">
                        <Skeleton class="h-[13px] w-full mb-2" />
                        <Skeleton class="h-[13px] w-full mb-2" />
                        <Skeleton class="h-[13px] w-full mb-2" />
                        <Skeleton class="h-[13px] w-3/4" />
                    </span>
                </p>
            </a>
        </div>
    </section>
</template>

<style scoped>
.explore-skeleton {
    display: block;
}
</style>
