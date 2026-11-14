<script setup lang="ts">
import { ref } from "vue";
import { SemanticSearch } from "#writing/search";
import type { Nullable, SearchHit } from "#writing/search";

// Semantic search over the posts. It runs on submit, not per keystroke, so
// each search costs one embedding. Keyword search stays in the header button.

const client = new SemanticSearch();

const q = ref("");

const hits = ref<Nullable<Array<SearchHit>>>(null);

const state = ref<"idle" | "loading" | "done" | "down">("idle");

async function submit() {
    const query = q.value.trim();

    if (!query) {
        return;
    }

    state.value = "loading";

    hits.value = await client.query(query);

    state.value = hits.value === null ? "down" : "done";
}
</script>

<template>
    <form class="wr-ask" role="search" @submit.prevent="submit">
        <input
            v-model="q"
            class="wr-ask__input"
            type="search"
            name="q"
            maxlength="200"
            placeholder="Search by meaning, e.g. replacing a banking core"
            aria-label="Search posts by meaning"
        />
        <button class="wr-ask__go" type="submit" :disabled="state === 'loading'">Search</button>
    </form>

    <div v-if="state !== 'idle'" class="wr-ask__out" aria-live="polite">
        <p v-if="state === 'loading'" class="wr-ask__note">Searching…</p>
        <p v-else-if="state === 'down'" class="wr-ask__note">
            Search by meaning is unavailable. Use the keyword search above.
        </p>
        <p v-else-if="!hits?.length" class="wr-ask__note">No matches.</p>
        <template v-else>
            <a v-for="hit in hits" :key="hit.url" :href="hit.url" class="wr-related__item">
                <div class="wr-related__title">{{ hit.title }}</div>
            </a>
        </template>
    </div>
</template>
