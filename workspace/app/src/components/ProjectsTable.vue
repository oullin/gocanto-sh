<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { projects } from "@gocanto/data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAsyncInView } from "@lib/useAsyncInView";

type Row = {
    title: string;
    url: string;
    language: string;
    tags: { label: string; color: string }[];
};

const PLACEHOLDER_COUNT = 10;
const placeholders: Row[] = Array.from({ length: PLACEHOLDER_COUNT }, () => ({
    title: "",
    url: "#",
    language: "",
    tags: [],
}));

const section = ref<HTMLElement | null>(null);

const allRows = useAsyncInView<Row[]>(section, () =>
    [...projects.data]
        .sort((a, b) => a.sort - b.sort)
        .map((p) => ({
            title: p.title,
            url: p.url,
            language: p.language,
            tags: [
                { label: p.language, color: "blue" },
                ...(p.is_open_source
                    ? [{ label: "Open Source", color: "green" }]
                    : []),
            ],
        })),
);

const languages = computed<string[]>(() => {
    if (!allRows.value) {return [];}
    const seen = new Set<string>();
    for (const r of allRows.value) {seen.add(r.language);}
    return [...seen].sort();
});

const selected = ref<Set<string>>(new Set());
const popoverOpen = ref(false);
const showMore = ref(false);
const collapsedLimit = 10;
const filtering = ref(false);

const filteredRows = computed<Row[]>(() => {
    if (!allRows.value) {return placeholders;}
    return selected.value.size === 0
        ? allRows.value
        : allRows.value.filter((r) => selected.value.has(r.language));
});

const visibleRows = computed<Row[]>(() =>
    showMore.value ? filteredRows.value : filteredRows.value.slice(0, collapsedLimit),
);

const toggleLanguage = (lang: string) => {
    const next = new Set(selected.value);
    if (next.has(lang)) {next.delete(lang);}
    else {next.add(lang);}
    selected.value = next;
};

const clearSelection = () => {
    selected.value = new Set();
};

const buttonLabel = computed(() => {
    if (selected.value.size === 0) {return "Filter projects";}
    if (selected.value.size === 1) {return [...selected.value][0];}
    return `${selected.value.size} languages`;
});

watch(
    selected,
    () => {
        filtering.value = true;
        window.setTimeout(() => {
            filtering.value = false;
        }, 220);
    },
    { deep: true },
);

const isLoaded = computed(() => allRows.value !== null);
const showSkeleton = computed(() => !isLoaded.value || filtering.value);
</script>

<template>
    <section ref="section" class="frame-section">
        <div class="section-heading">
            <h2>Projects</h2>
            <Popover v-model:open="popoverOpen">
                <PopoverTrigger as-child>
                    <button
                        class="filter-dropdown"
                        type="button"
                        aria-haspopup="listbox"
                        :aria-expanded="popoverOpen"
                        :disabled="!isLoaded"
                    >
                        <span class="filter-icon" aria-hidden="true">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="4" y1="6" x2="14" y2="6" />
                                <line x1="18" y1="6" x2="20" y2="6" />
                                <circle cx="16" cy="6" r="2" />
                                <line x1="4" y1="12" x2="8" y2="12" />
                                <line x1="12" y1="12" x2="20" y2="12" />
                                <circle cx="10" cy="12" r="2" />
                                <line x1="4" y1="18" x2="14" y2="18" />
                                <line x1="18" y1="18" x2="20" y2="18" />
                                <circle cx="16" cy="18" r="2" />
                            </svg>
                        </span>
                        <span>{{ buttonLabel }}</span>
                        <span class="filter-chevron" aria-hidden="true">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </span>
                    </button>
                </PopoverTrigger>
                <PopoverContent align="end" class="w-64 p-0">
                    <div class="flex items-center justify-between px-3 py-2 border-b text-xs text-muted-foreground">
                        <span>Filter by language</span>
                        <Button
                            v-if="selected.size > 0"
                            variant="ghost"
                            size="sm"
                            class="h-6 px-2 text-xs"
                            @click="clearSelection"
                        >
                            Clear
                        </Button>
                    </div>
                    <ul class="p-1 max-h-72 overflow-y-auto">
                        <li v-for="lang in languages" :key="lang">
                            <label class="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer text-sm">
                                <Checkbox
                                    :model-value="selected.has(lang)"
                                    @update:model-value="() => toggleLanguage(lang)"
                                />
                                <span>{{ lang }}</span>
                            </label>
                        </li>
                    </ul>
                </PopoverContent>
            </Popover>
        </div>
        <div class="guides-list">
            <template v-if="showSkeleton">
                <div v-for="i in PLACEHOLDER_COUNT" :key="`sk-${i}`" class="row" aria-busy="true" aria-hidden="true">
                    <Skeleton class="h-[25px] w-2/3" />
                    <span class="tags">
                        <Skeleton class="h-6 w-12 rounded-full" />
                        <Skeleton class="h-6 w-20 rounded-full" />
                    </span>
                </div>
            </template>
            <template v-else>
                <a v-for="row in visibleRows" :key="row.title" :href="row.url" class="row" target="_blank" rel="noopener noreferrer">
                    <span class="title">{{ row.title }}</span>
                    <span class="tags">
                        <span v-for="t in row.tags" :key="t.label" class="pill">
                            {{ t.label }}
                        </span>
                    </span>
                </a>
                <p v-if="visibleRows.length === 0" class="px-8 py-6 text-sm text-muted-foreground">
                    No projects match the current filter.
                </p>
            </template>
        </div>
        <div class="show-more">
            <button
                v-if="isLoaded && filteredRows.length > collapsedLimit"
                class="btn ghost"
                type="button"
                @click="showMore = !showMore"
            >
                {{ showMore ? "Show less" : `Show more (${filteredRows.length - collapsedLimit})` }}
            </button>
        </div>
    </section>
</template>
