<script setup lang="ts">
import { computed, ref, shallowRef } from "vue";
import type { RecommendationRecord } from "@gocanto/store";
import SearchResultDetail, { type SearchPayload } from "@components/SearchResultDetail.vue";
import { useAsyncInView } from "@lib/useAsyncInView";

type RecCard = {
    id: string;
    quote: string;
    markHead: string;
    quoteTail: string;
    initials: string;
    name: string;
    titleLine: string;
    featured: boolean;
};

const QUOTE_MAX = 220;
const MARK_WORDS = 7;
const SKELETON_COUNT = 6;
const skeletonCards = Array.from({ length: SKELETON_COUNT }, (_, index) => index);

const stripHtml = (s: string): string =>
    s
        .replace(/<br\s*\/?\s*>/gi, " ")
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();

const truncate = (text: string, max: number): string => {
    if (text.length <= max) {
        return text;
    }

    const slice = text.slice(0, max);
    const lastSpace = slice.lastIndexOf(" ");

    return `${slice.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
};

const initialsOf = (full: string): string => {
    const parts = full.trim().split(/\s+/);

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const toCard = (r: RecommendationRecord): RecCard => {
    const cleaned = stripHtml(r.text);
    const quoteText = truncate(cleaned, QUOTE_MAX);
    const words = quoteText.split(/\s+/);
    const head = words.slice(0, MARK_WORDS).join(" ");
    const tail = words.slice(MARK_WORDS).join(" ");

    return {
        id: r.uuid,
        quote: quoteText,
        markHead: head,
        quoteTail: tail ? ` ${tail}` : "",
        initials: initialsOf(r.person.full_name),
        name: r.person.full_name,
        titleLine: `${r.person.designation} · ${r.person.company}`,
        featured: r.featured === 1,
    };
};

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
    const featured = sorted.filter((r) => r.featured === 1);
    const others = sorted.filter((r) => r.featured !== 1);

    return [...featured, ...others].slice(0, SKELETON_COUNT);
});

const byId = computed<Map<string, RecommendationRecord>>(
    () => new Map(picked.value.map((r) => [r.uuid, r])),
);

const cards = computed<RecCard[]>(() => picked.value.map(toCard));
const loading = computed(() => recommendationsFixture.value === null);

const sheetOpen = ref(false);
const activePayload = shallowRef<SearchPayload | null>(null);

function openRec(id: string) {
    const record = byId.value.get(id);

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

        <div class="rec-grid">
            <template v-if="loading">
                <div
                    v-for="i in skeletonCards"
                    :key="`rec-skeleton-${i}`"
                    class="rec rec-skeleton"
                    aria-hidden="true"
                >
                    <div class="rec-skeleton__quote">
                        <span class="rec-skeleton__line rec-skeleton__line--full" />
                        <span class="rec-skeleton__line rec-skeleton__line--wide" />
                        <span class="rec-skeleton__line rec-skeleton__line--medium" />
                        <span class="rec-skeleton__line rec-skeleton__line--short" />
                    </div>
                    <div class="rec-by">
                        <span class="avatar rec-skeleton__avatar" />
                        <div class="rec-who rec-skeleton__who">
                            <span class="rec-skeleton__line rec-skeleton__line--name" />
                            <span class="rec-skeleton__line rec-skeleton__line--title" />
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <button
                    v-for="c in cards"
                    :key="c.id"
                    type="button"
                    class="rec"
                    :class="{ 'hi-bg': c.featured }"
                    @click="openRec(c.id)"
                >
                    <p class="rec-quote">
                        “<span class="mark">{{ c.markHead }}</span
                        >{{ c.quoteTail }}”
                    </p>
                    <div class="rec-by">
                        <div class="avatar" aria-hidden="true">
                            <span>{{ c.initials }}</span>
                        </div>
                        <div class="rec-who">
                            <span class="rec-name">{{ c.name }}</span>
                            <span class="rec-title">{{ c.titleLine }}</span>
                        </div>
                    </div>
                </button>
            </template>
        </div>
    </section>
    <SearchResultDetail v-model:open="sheetOpen" :payload="activePayload" />
</template>
