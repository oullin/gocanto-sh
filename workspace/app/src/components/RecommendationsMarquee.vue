<script setup lang="ts">
import { computed, ref, shallowRef } from "vue";
import type { RecommendationRecord } from "@gocanto/store";
import { TestimonialMarquee, type Testimonial } from "@/components/ui/testimonial-marquee";
import SearchResultDetail, { type SearchPayload } from "@components/SearchResultDetail.vue";
import { useAsyncInView } from "@lib/useAsyncInView";

const AVATAR_BASE = "https://oullin.io/images/";

const section = ref<HTMLElement | null>(null);
const recommendationsFixture = useAsyncInView(section, async () => {
    const store = await import("@gocanto/store/recommendations");

    return store.recommendations;
});

const picked = computed<RecommendationRecord[]>(() => {
    if (!recommendationsFixture.value) {
        return [];
    }

    const sorted = [...recommendationsFixture.value.data].sort((a, b) =>
        b.created_at.localeCompare(a.created_at),
    );

    return sorted;
});

const byId = computed<Map<string, RecommendationRecord>>(
    () => new Map(picked.value.map((r) => [r.uuid, r])),
);

const items = computed<Testimonial[]>(() =>
    picked.value.map((r) => ({
        id: r.uuid,
        name: r.person.full_name,
        text: r.text,
        avatar: AVATAR_BASE + r.person.avatar,
        role: r.person.designation,
        company: r.person.company,
        featured: r.featured === 1,
    })),
);
const loading = computed(() => recommendationsFixture.value === null);

const sheetOpen = ref(false);
const activePayload = shallowRef<SearchPayload | null>(null);

function handleSelect(item: Testimonial) {
    const record = byId.value.get(item.id);

    if (!record) {
        return;
    }

    activePayload.value = { kind: "Recommendation", data: record };
    sheetOpen.value = true;
}
</script>

<template>
    <section id="testimonials" ref="section">
        <div class="sect-head">
            <div>
                <span class="kicker">Proof · What people I've worked with say</span>
                <h2>Testimonials.</h2>
            </div>
            <div class="sub">
                Notes from engineers, managers, and founders I've shipped real things with. The
                <span style="color: var(--amber)">highlighted ones</span> are the ones I'd point a
                recruiter to first.
            </div>
        </div>

        <TestimonialMarquee
            :items="items"
            :speed="160"
            :loading="loading"
            @select="handleSelect"
        />
    </section>
    <SearchResultDetail v-model:open="sheetOpen" :payload="activePayload" />
</template>
