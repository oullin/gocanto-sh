<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Projects } from "@gocanto/domain";
import { projects } from "@gocanto/store";
import { Popover, PopoverContent, PopoverTrigger } from "#app/components/ui/popover";
import { Checkbox } from "#app/components/ui/checkbox";
import { Button } from "#app/components/ui/button";
import { ScrollFade } from "#app/components/ui/scroll-fade";
import { useInViewReady } from "#app/lib/useAsyncInView";

const section = ref<HTMLElement | null>(null);
const allRows = Projects.rows(projects);
const languages = Projects.languages(allRows);

const selected = ref<Set<string>>(new Set());

const popoverOpen = ref(false);

const filtering = ref(false);

const filteredRows = computed(() => Projects.filter(allRows, selected.value));

const toggleLanguage = (lang: string) => {
    const next = new Set(selected.value);

    if (next.has(lang)) {
        next.delete(lang);
    } else {
        next.add(lang);
    }

    selected.value = next;
};

const clearSelection = () => {
    selected.value = new Set();
};

const buttonLabel = computed(() => {
    if (selected.value.size === 0) {
        return "Filter";
    }

    if (selected.value.size === 1) {
        return [...selected.value][0];
    }

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

const ready = useInViewReady(section);

const isLoading = computed(() => !ready.value || filtering.value);
</script>

<template>
    <section id="projects" ref="section" class="frame-section">
        <div class="sect-head projects-head">
            <div>
                <span class="kicker">Built · Shipped in public</span>
                <h2>Projects.</h2>
            </div>
            <div class="projects-head__side">
                <div class="sub">
                    Selected systems, packages, and experiments across banking, fintech, ecommerce,
                    and performance.
                </div>
                <Popover v-model:open="popoverOpen">
                    <PopoverTrigger as-child>
                        <button
                            class="filter-dropdown"
                            type="button"
                            aria-haspopup="listbox"
                            :aria-expanded="popoverOpen"
                            :disabled="!ready"
                        >
                            <span class="filter-icon" aria-hidden="true">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.75"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
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
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </span>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" class="w-64 p-0">
                        <div
                            class="flex items-center justify-between px-3 py-2 border-b text-xs text-muted-foreground"
                        >
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
                                <label
                                    class="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer text-sm"
                                >
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
        </div>
        <ScrollFade class="projects-scroll">
            <div class="guides-list">
                <a
                    v-for="row in filteredRows"
                    :key="row.title"
                    :href="row.url"
                    class="row"
                    target="_blank"
                    rel="noopener noreferrer"
                    :aria-busy="isLoading || undefined"
                    :tabindex="isLoading ? -1 : undefined"
                    @click="isLoading && $event.preventDefault()"
                >
                    <span class="row-text">
                        <span class="title">
                            <span :class="{ 'sk-shimmer': isLoading }">{{ row.title }}</span>
                        </span>
                        <span v-if="row.excerpt" class="row-excerpt">
                            <span :class="{ 'sk-shimmer': isLoading }">{{ row.excerpt }}</span>
                        </span>
                    </span>
                    <span class="tags">
                        <span
                            v-for="t in row.tags"
                            :key="t.label"
                            class="pill"
                            :class="isLoading ? 'sk-shimmer-pill' : t.color"
                        >
                            {{ t.label }}
                        </span>
                    </span>
                </a>
                <p v-if="filteredRows.length === 0" class="px-8 py-6 text-sm text-muted-foreground">
                    No projects match the current filter.
                </p>
            </div>
        </ScrollFade>
    </section>
</template>
