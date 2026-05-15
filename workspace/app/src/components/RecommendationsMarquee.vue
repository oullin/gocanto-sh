<script setup lang="ts">
import { computed, ref, shallowRef } from "vue";
import { recommendations } from "@gocanto/store";
import type { RecommendationRecord } from "@gocanto/store";
import { TestimonialMarquee, type Testimonial } from "@/components/ui/testimonial-marquee";
import SearchResultDetail, { type SearchPayload } from "@components/SearchResultDetail.vue";
import { useInViewReady } from "@lib/useAsyncInView";

const AVATAR_BASE = "https://oullin.io/images/";

const sorted = [...recommendations.data].sort((a, b) => b.created_at.localeCompare(a.created_at));

const byId: Map<string, RecommendationRecord> = new Map(sorted.map((r) => [r.uuid, r]));

const items: Testimonial[] = sorted.map((r) => ({
    id: r.uuid,
    name: r.person.full_name,
    text: r.text,
    avatar: AVATAR_BASE + r.person.avatar,
    role: r.person.designation,
    company: r.person.company,
    featured: r.featured === 1,
}));

const sheetOpen = ref(false);
const activePayload = shallowRef<SearchPayload | null>(null);

const section = ref<HTMLElement | null>(null);
const ready = useInViewReady(section);
const isLoading = computed(() => !ready.value);

function handleSelect(item: Testimonial) {
    const record = byId.get(item.id);

    if (!record) {
        return;
    }

    activePayload.value = { kind: "Recommendation", data: record };
    sheetOpen.value = true;
}
</script>

<template>
    <section id="recommendations" ref="section" class="recommendations-section frame-section">
        <header class="recommendations-section__header">
            <h2>Recommendations</h2>
            <p class="recommendations-section__lede">
                Words from people I've actually shipped with — engineers I've managed, peers across
                product and design, and leaders I've reported to. The
                <span class="recommendations-section__hl">highlighted</span> ones are the ones I
                keep coming back to. Click any card to read the full note.
            </p>
        </header>
        <TestimonialMarquee
            :items="items"
            :speed="120"
            :loading="isLoading"
            @select="handleSelect"
        />
    </section>
    <SearchResultDetail v-model:open="sheetOpen" :payload="activePayload" />
</template>

<style scoped>
.recommendations-section {
    padding: 48px 0 32px;
}
.recommendations-section__header {
    padding: 0 24px 8px;
}
.recommendations-section__header h2 {
    font-size: 32px;
    font-weight: 600;
    letter-spacing: -0.02em;
}
.recommendations-section__lede {
    margin-top: 10px;
    max-width: 60ch;
    font-size: 15px;
    line-height: 1.55;
    color: var(--muted-foreground);
}
.recommendations-section__hl {
    color: var(--accent-amber);
    font-weight: 500;
}
</style>
