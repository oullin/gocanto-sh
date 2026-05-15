<script setup lang="ts">
import { computed, ref, shallowRef, watch } from "vue";
import { useEventListener } from "@vueuse/core";
import {
    BookOpen,
    FileText,
    GraduationCap,
    Link as LinkIcon,
    Mic,
    Quote,
    Search,
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
import { Skeleton } from "@/components/ui/skeleton";
import SearchResultDetail, {
    type SearchPayload,
} from "@components/SearchResultDetail.vue";

type Result = {
    key: string;
    title: string;
    searchText: string;
    payload: SearchPayload;
};

type Corpus = {
    work: Result[];
    projects: Result[];
    skills: Result[];
    education: Result[];
    talks: Result[];
    recommendations: Result[];
    links: Result[];
};

type KindKey = keyof Corpus;

const KINDS: { key: KindKey; label: string }[] = [
    { key: "work", label: "Work" },
    { key: "projects", label: "Projects" },
    { key: "skills", label: "Skills" },
    { key: "education", label: "Education" },
    { key: "talks", label: "Talks" },
    { key: "recommendations", label: "Recommendations" },
    { key: "links", label: "Links" },
];

const groupIcons = {
    work: BookOpen,
    projects: FileText,
    skills: Sparkles,
    education: GraduationCap,
    talks: Mic,
    recommendations: Quote,
    links: LinkIcon,
} as const;

const open = ref(false);
const sheetOpen = ref(false);
const activePayload = shallowRef<SearchPayload | null>(null);
const corpus = shallowRef<Corpus | null>(null);
const loading = ref(false);
const selectedKind = ref<KindKey | null>(null);

const isKindVisible = (k: KindKey) =>
    selectedKind.value === null || selectedKind.value === k;

const visibleKinds = computed(() =>
    KINDS.filter((k) => isKindVisible(k.key)),
);

const toggleKind = (k: KindKey) => {
    selectedKind.value = selectedKind.value === k ? null : k;
};

// Strip HTML, then append an alphanumeric-only variant of the same text so
// queries like "as400" match content that says "AS/400", "node.js" matches
// "Node.js", "kafkago" matches "Kafka + Go", etc. Both forms are kept so
// natural-language queries (e.g. "kafka") still match the original spacing.
function searchable(...parts: string[]): string {
    const clean = parts
        .filter(Boolean)
        .join(" ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    const compact = clean.replace(/[^A-Za-z0-9]+/g, "");
    return `${clean} ${compact}`;
}

async function buildCorpus(): Promise<Corpus> {
    // Dynamically import fixtures so module-init cost is deferred.
    const { education, experience, links, profile, projects, recommendations, talks } =
        await import("@gocanto/data");

    return {
        work: experience.data.map((e) => ({
            key: `exp:${e.uuid}`,
            title: `${e.position} · ${e.company}`,
            searchText: searchable(
                e.position,
                e.company,
                e.country,
                e.city,
                e.skills,
                e.summary,
                e.start_date,
                e.end_date,
            ),
            payload: { kind: "Work", data: e },
        })),
        projects: projects.data.map((p) => ({
            key: `project:${p.uuid}`,
            title: p.title,
            searchText: searchable(
                p.title,
                p.language,
                p.excerpt,
                p.is_open_source ? "open source" : "",
            ),
            payload: { kind: "Project", data: p },
        })),
        skills: profile.data.skills.map((s) => ({
            key: `skill:${s.uuid}`,
            title: s.item,
            searchText: searchable(s.item, s.description),
            payload: { kind: "Skill", data: s },
        })),
        education: education.data.map((e) => ({
            key: `edu:${e.uuid}`,
            title: `${e.degree} · ${e.field}`,
            searchText: searchable(
                e.degree,
                e.field,
                e.school,
                e.issuing_country,
                e.graduated_at,
                e.description,
            ),
            payload: { kind: "Education", data: e },
        })),
        talks: talks.data.map((t) => ({
            key: `talk:${t.uuid}`,
            title: t.title,
            searchText: searchable(t.title, t.subject, t.location),
            payload: { kind: "Talk", data: t },
        })),
        recommendations: recommendations.data.map((r) => ({
            key: `rec:${r.uuid}`,
            title: `${r.person.full_name} · ${r.person.company}`,
            searchText: searchable(
                r.person.full_name,
                r.person.company,
                r.person.designation,
                r.relation,
                r.text,
            ),
            payload: { kind: "Recommendation", data: r },
        })),
        links: links.data.map((l) => ({
            key: `link:${l.uuid}`,
            title: `${l.name} · ${l.handle}`,
            searchText: searchable(l.name, l.handle, l.url, l.description),
            payload: { kind: "Link", data: l },
        })),
    };
}

const ready = computed(() => !loading.value && corpus.value !== null);

watch(open, async (v) => {
    if (!v) {
        selectedKind.value = null;
        return;
    }
    if (corpus.value) {return;}
    loading.value = true;
    try {
        corpus.value = await buildCorpus();
    } finally {
        loading.value = false;
    }
});

const activeKey = ref<string | null>(null);

const handleSelect = (r: Result) => {
    activePayload.value = r.payload;
    activeKey.value = r.key;
    // Keep the Command dialog open behind the Sheet — closing the Sheet
    // returns the user to the palette with their previous selection still
    // highlighted.
    sheetOpen.value = true;
};

useEventListener(window, "keydown", (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open.value = !open.value;
    }
});

// When the Sheet closes, re-highlight and scroll to the previously-selected
// item inside the still-open palette. Reka-ui's Listbox clears its highlight
// when focus leaves to the Sheet, so we re-trigger it via pointermove (the
// Command root has highlightOnHover enabled, and reka-ui listens for pointer
// events rather than legacy mouse events).
watch(sheetOpen, (v) => {
    if (v) {return;}
    const key = activeKey.value;
    if (!key) {return;}
    window.setTimeout(() => {
        const target = document.querySelector<HTMLElement>(
            `[data-slot="command-item"][data-item-key="${CSS.escape(key)}"]`,
        );
        if (!target) {return;}
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
    <section class="global-search frame-section">
        <button class="search-button" type="button" @click="open = true">
            <span class="search-button__icon" aria-hidden="true">
                <Search :size="16" />
            </span>
            <span class="search-button__label">Search work, projects, skills, education, talks, and more</span>
            <kbd class="kbd">
                <span>⌘</span>
                <span>K</span>
            </kbd>
        </button>
    </section>

    <CommandDialog
        v-model:open="open"
        title="Search"
        description="Search work, projects, skills, education, talks, recommendations, and links"
    >
        <CommandInput placeholder="What are you searching for?" />
        <div class="search-filters" role="group" aria-label="Filter by kind">
            <button
                v-for="k in KINDS"
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
            <template v-if="!ready">
                <div class="px-3 py-3" aria-busy="true">
                    <Skeleton v-for="i in 6" :key="i" class="h-10 w-full my-1" />
                </div>
            </template>
            <template v-else-if="corpus">
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
