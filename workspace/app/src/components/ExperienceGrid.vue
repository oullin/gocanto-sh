<script setup lang="ts">
import { ref, shallowRef } from "vue";
import { listFeaturedWorkCards, type SearchPayload } from "@gocanto/domain";
import { experience, type ExperienceRecord } from "@gocanto/store";
import { useInViewReady } from "@lib/useAsyncInView";
import SearchResultDetail from "@components/SearchResultDetail.vue";

const PLACEHOLDER_COUNT = 6;

const section = ref<HTMLElement | null>(null);

const guides = listFeaturedWorkCards(experience, PLACEHOLDER_COUNT);

const ready = useInViewReady(section);

const sheetOpen = ref(false);
const activePayload = shallowRef<SearchPayload | null>(null);

function openExperience(e: ExperienceRecord) {
    activePayload.value = { kind: "Work", data: e };
    sheetOpen.value = true;
}
</script>

<template>
    <section id="work" ref="section" class="frame-section">
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

        <div class="guides-grid">
            <button
                v-for="g in guides"
                :key="g.record.uuid"
                type="button"
                class="guide-card"
                :aria-busy="!ready"
                :disabled="!ready"
                @click="openExperience(g.record)"
            >
                <div>
                    <h3>
                        <span :class="{ 'sk-shimmer': !ready }">{{ g.title }}</span>
                    </h3>
                    <p>
                        <span :class="{ 'sk-shimmer': !ready }">{{ g.excerpt }}…</span>
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
            </button>
        </div>

        <SearchResultDetail v-model:open="sheetOpen" :payload="activePayload" />
    </section>
</template>
