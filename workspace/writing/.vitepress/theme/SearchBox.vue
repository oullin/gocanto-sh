<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { VPNavBarSearch } from "vitepress/theme";
import { SemanticSearch } from "#writing/search";
import type { Nullable, SearchHit } from "#writing/search";

// The main search box: search by meaning, run on submit so each search costs
// one embedding. VitePress local search stays mounted but hidden. It still
// answers ⌘K and "/", the results panel links to it, and it opens with the
// same query when the Worker cannot answer.

const client = new SemanticSearch();

const root = ref<Nullable<HTMLElement>>(null);

const q = ref("");

const hits = ref<Nullable<Array<SearchHit>>>(null);

const state = ref<"idle" | "loading" | "done">("idle");

async function submit() {
    const query = q.value.trim();

    if (!query) {
        return;
    }

    state.value = "loading";

    hits.value = await client.query(query);

    if (hits.value === null) {
        close();
        openKeyword(query);

        return;
    }

    state.value = "done";
}

function close() {
    state.value = "idle";
}

// VitePress keeps the local search query in session storage and reads it when
// the modal opens, so writing it first opens the modal with the query typed in.
function openKeyword(query: string) {
    try {
        sessionStorage.setItem("vitepress:local-search-filter", query);
    } catch {
        // Storage can be blocked; the modal then opens empty.
    }

    root.value?.querySelector<HTMLButtonElement>("#local-search button")?.click();
}

function onPointerDown(event: PointerEvent) {
    if (root.value && !root.value.contains(event.target as Node)) {
        close();
    }
}

onMounted(() => {
    document.addEventListener("pointerdown", onPointerDown);
});

onBeforeUnmount(() => {
    document.removeEventListener("pointerdown", onPointerDown);
});
</script>

<template>
    <div ref="root" class="wr-ask" @keydown.esc="close">
        <form role="search" @submit.prevent="submit">
            <svg class="wr-ask__icon" viewBox="0 0 20 20" aria-hidden="true">
                <path
                    d="M14.386 14.386l4.088 4.088-4.088-4.088A7.533 7.533 0 1 1 3.733 3.733a7.533 7.533 0 0 1 10.653 10.653z"
                    stroke="currentColor"
                    fill="none"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
            <input
                v-model="q"
                class="wr-ask__input"
                type="search"
                name="q"
                maxlength="200"
                placeholder="Search writing…"
                aria-label="Search posts by meaning"
            />
        </form>

        <div v-if="state !== 'idle'" class="wr-ask__panel" aria-live="polite">
            <p v-if="state === 'loading'" class="wr-ask__note">Searching…</p>
            <p v-else-if="!hits?.length" class="wr-ask__note">No matches.</p>
            <template v-else>
                <a v-for="hit in hits" :key="hit.url" :href="hit.url" class="wr-ask__hit">
                    {{ hit.title }}
                </a>
            </template>
            <button
                v-if="state === 'done'"
                type="button"
                class="wr-ask__keyword"
                @click="openKeyword(q.trim())"
            >
                Keyword search instead
            </button>
        </div>

        <div class="wr-ask__local">
            <VPNavBarSearch />
        </div>
    </div>
</template>
