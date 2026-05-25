<script setup lang="ts">
import { computed, ref, shallowRef, watch } from "vue";
import {
    BookOpen,
    FileText,
    GraduationCap,
    Link as LinkIcon,
    Mic,
    Quote,
    Sparkles,
} from "lucide-vue-next";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    buildSearchCorpus,
    SEARCH_KINDS,
    type SearchCorpus,
    type SearchKind,
    type SearchResult,
} from "@gocanto/domain";
import { education, experience, links, profile, projects, talks } from "@gocanto/store";
import SearchResultDetail from "@components/SearchResultDetail.vue";
import { globalSearchOpen } from "@lib/globalSearch";

const groupIcons = {
    work: BookOpen,
    projects: FileText,
    skills: Sparkles,
    education: GraduationCap,
    talks: Mic,
    recommendations: Quote,
    links: LinkIcon,
} as const;

const open = globalSearchOpen;
const sheetOpen = ref(false);
const activePayload = shallowRef<SearchResult["payload"] | null>(null);
const corpus = shallowRef<SearchCorpus | null>(null);
const selectedKind = ref<SearchKind | null>(null);
let corpusLoading = false;

const isKindVisible = (k: SearchKind) => selectedKind.value === null || selectedKind.value === k;

const visibleKinds = computed(() => SEARCH_KINDS.filter((k) => isKindVisible(k.key)));

const toggleKind = (k: SearchKind) => {
    selectedKind.value = selectedKind.value === k ? null : k;
};

async function buildCorpus(): Promise<SearchCorpus> {
    const { recommendations } = await import("@gocanto/store/recommendations");

    return buildSearchCorpus({
        education,
        experience,
        links,
        profile,
        projects,
        recommendations,
        talks,
    });
}

watch(open, (v) => {
    if (!v) {
        selectedKind.value = null;

        return;
    }

    if (corpus.value || corpusLoading) {
        return;
    }

    corpusLoading = true;
    void buildCorpus()
        .then((nextCorpus) => {
            corpus.value = nextCorpus;
            corpusLoading = false;
        })
        .catch(() => {
            corpusLoading = false;
        });
});

const activeKey = ref<string | null>(null);

const handleSelect = (r: SearchResult) => {
    activePayload.value = r.payload;
    activeKey.value = r.key;
    // Keep the Command dialog open behind the Sheet — closing the Sheet
    // returns the user to the palette with their previous selection still
    // highlighted.
    sheetOpen.value = true;
};

// When the Sheet closes, re-highlight and scroll to the previously-selected
// item inside the still-open palette. Reka-ui's Listbox clears its highlight
// when focus leaves to the Sheet, so we re-trigger it via pointermove (the
// Command root has highlightOnHover enabled, and reka-ui listens for pointer
// events rather than legacy mouse events).
watch(sheetOpen, (v) => {
    if (v) {
        return;
    }

    const key = activeKey.value;

    if (!key) {
        return;
    }

    window.setTimeout(() => {
        const target = document.querySelector<HTMLElement>(
            `[data-slot="command-item"][data-item-key="${CSS.escape(key)}"]`,
        );

        if (!target) {
            return;
        }

        const rect = target.getBoundingClientRect();
        const init = {
            bubbles: true,
            cancelable: true,
            pointerType: "mouse",
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2,
        };

        target.dispatchEvent(new PointerEvent("pointerenter", init));
        target.dispatchEvent(new PointerEvent("pointermove", init));
        target.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 300);
});
</script>

<template>
    <CommandDialog
        v-model:open="open"
        title="Search"
        description="Search work, projects, skills, education, talks, recommendations, and links"
    >
        <CommandInput placeholder="What are you searching for?" />
        <div class="search-filters" role="group" aria-label="Filter by kind">
            <button
                v-for="k in SEARCH_KINDS"
                :key="k.key"
                type="button"
                class="search-filters__chip"
                :class="{ 'is-active': selectedKind === k.key }"
                :aria-pressed="selectedKind === k.key"
                @click="toggleKind(k.key)"
            >
                {{ k.label }}
            </button>
        </div>
        <CommandList class="cmd-list">
            <template v-if="corpus">
                <CommandEmpty class="px-5 py-10 text-center text-sm text-muted-foreground">
                    No matches found.
                </CommandEmpty>
                <template v-for="kind in visibleKinds" :key="kind.key">
                    <CommandGroup :heading="kind.label">
                        <CommandItem
                            v-for="r in corpus[kind.key]"
                            :key="r.key"
                            :value="r.key"
                            :data-item-key="r.key"
                            @select="handleSelect(r)"
                        >
                            <component :is="groupIcons[kind.key]" />
                            <span class="truncate">{{ r.title }}</span>
                            <span class="sr-only">{{ r.searchText }}</span>
                        </CommandItem>
                    </CommandGroup>
                </template>
            </template>
        </CommandList>
    </CommandDialog>

    <SearchResultDetail v-model:open="sheetOpen" :payload="activePayload" />
</template>
