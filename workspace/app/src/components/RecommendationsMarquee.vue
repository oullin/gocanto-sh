<script setup lang="ts">
import { ref, shallowRef } from "vue";
import { recommendations } from "@gocanto/store";
import type { RecommendationRecord } from "@gocanto/store";
import SearchResultDetail, { type SearchPayload } from "@components/SearchResultDetail.vue";
import { useInViewReady } from "@lib/useAsyncInView";

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

const sorted = [...recommendations.data].sort((a, b) => b.created_at.localeCompare(a.created_at));
const featured = sorted.filter((r) => r.featured === 1);
const others = sorted.filter((r) => r.featured !== 1);
const picked: RecommendationRecord[] = [...featured, ...others].slice(0, 6);

const byId: Map<string, RecommendationRecord> = new Map(picked.map((r) => [r.uuid, r]));

const cards: RecCard[] = picked.map((r) => {
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
});

const sheetOpen = ref(false);
const activePayload = shallowRef<SearchPayload | null>(null);

const section = ref<HTMLElement | null>(null);
const ready = useInViewReady(section);

function openRec(id: string) {
    const record = byId.get(id);
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
            <button
                v-for="c in cards"
                :key="c.id"
                type="button"
                class="rec"
                :class="{ 'hi-bg': c.featured }"
                :aria-busy="!ready"
                @click="openRec(c.id)"
            >
                <p class="rec-quote">
                    <span :class="{ 'sk-shimmer': !ready }">
                        “<span class="mark">{{ c.markHead }}</span>{{ c.quoteTail }}”
                    </span>
                </p>
                <div class="rec-by">
                    <div class="avatar" aria-hidden="true">
                        <span :class="{ 'sk-shimmer': !ready }">{{ c.initials }}</span>
                    </div>
                    <div class="rec-who">
                        <span class="rec-name"><span :class="{ 'sk-shimmer': !ready }">{{ c.name }}</span></span>
                        <span class="rec-title"><span :class="{ 'sk-shimmer': !ready }">{{ c.titleLine }}</span></span>
                    </div>
                </div>
            </button>
        </div>
    </section>
    <SearchResultDetail v-model:open="sheetOpen" :payload="activePayload" />
</template>
