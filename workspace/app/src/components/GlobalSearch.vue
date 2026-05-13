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

const open = ref(false);
const sheetOpen = ref(false);
const activePayload = shallowRef<SearchPayload | null>(null);
const corpus = shallowRef<Corpus | null>(null);
const loading = ref(false);

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
    if (!v) {return;}
    if (corpus.value) {return;}
    loading.value = true;
    try {
        corpus.value = await buildCorpus();
    } finally {
        loading.value = false;
    }
});

const handleSelect = (r: Result) => {
    activePayload.value = r.payload;
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

// When the Sheet closes, restore visibility to the previously-selected item
// inside the still-open palette. cmdk preserves the data-highlighted attribute
// but the scroll position may be at the top, so we scroll it back into view.
watch(sheetOpen, (v) => {
    if (v) {return;}
    window.setTimeout(() => {
        const highlighted = document.querySelector<HTMLElement>(
            '[data-slot="command-item"][data-highlighted]',
        );
        highlighted?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 300);
});
</script>

<template>
    <section class="global-search frame-section">
        <button class="search-button" type="button" @click="open = true">
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
        <CommandList>
            <template v-if="!ready">
                <div class="px-3 py-3" aria-busy="true">
                    <Skeleton v-for="i in 6" :key="i" class="h-12 w-full my-1" />
                </div>
            </template>
            <template v-else-if="corpus">
                <CommandEmpty class="px-5 py-8 text-center text-sm text-muted-foreground">
                    No matches found.
                </CommandEmpty>
                <CommandGroup heading="Work">
                    <CommandItem
                        v-for="r in corpus.work"
                        :key="r.key"
                        :value="r.key"
                        @select="handleSelect(r)"
                    >
                        <BookOpen />
                        <span class="truncate">{{ r.title }}</span>
                        <span class="sr-only">{{ r.searchText }}</span>
                    </CommandItem>
                </CommandGroup>
                <CommandGroup heading="Projects">
                    <CommandItem
                        v-for="r in corpus.projects"
                        :key="r.key"
                        :value="r.key"
                        @select="handleSelect(r)"
                    >
                        <FileText />
                        <span class="truncate">{{ r.title }}</span>
                        <span class="sr-only">{{ r.searchText }}</span>
                    </CommandItem>
                </CommandGroup>
                <CommandGroup heading="Skills">
                    <CommandItem
                        v-for="r in corpus.skills"
                        :key="r.key"
                        :value="r.key"
                        @select="handleSelect(r)"
                    >
                        <Sparkles />
                        <span class="truncate">{{ r.title }}</span>
                        <span class="sr-only">{{ r.searchText }}</span>
                    </CommandItem>
                </CommandGroup>
                <CommandGroup heading="Education">
                    <CommandItem
                        v-for="r in corpus.education"
                        :key="r.key"
                        :value="r.key"
                        @select="handleSelect(r)"
                    >
                        <GraduationCap />
                        <span class="truncate">{{ r.title }}</span>
                        <span class="sr-only">{{ r.searchText }}</span>
                    </CommandItem>
                </CommandGroup>
                <CommandGroup heading="Talks">
                    <CommandItem
                        v-for="r in corpus.talks"
                        :key="r.key"
                        :value="r.key"
                        @select="handleSelect(r)"
                    >
                        <Mic />
                        <span class="truncate">{{ r.title }}</span>
                        <span class="sr-only">{{ r.searchText }}</span>
                    </CommandItem>
                </CommandGroup>
                <CommandGroup heading="Recommendations">
                    <CommandItem
                        v-for="r in corpus.recommendations"
                        :key="r.key"
                        :value="r.key"
                        @select="handleSelect(r)"
                    >
                        <Quote />
                        <span class="truncate">{{ r.title }}</span>
                        <span class="sr-only">{{ r.searchText }}</span>
                    </CommandItem>
                </CommandGroup>
                <CommandGroup heading="Links">
                    <CommandItem
                        v-for="r in corpus.links"
                        :key="r.key"
                        :value="r.key"
                        @select="handleSelect(r)"
                    >
                        <LinkIcon />
                        <span class="truncate">{{ r.title }}</span>
                        <span class="sr-only">{{ r.searchText }}</span>
                    </CommandItem>
                </CommandGroup>
            </template>
        </CommandList>
    </CommandDialog>

    <SearchResultDetail v-model:open="sheetOpen" :payload="activePayload" />
</template>
