<script setup lang="ts">
import { computed } from "vue";
import { DetailView, TextFormatter, UrlGuard, type SearchPayload } from "@gocanto/domain";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "#app/components/ui/sheet";

import {
    BookOpen,
    Calendar,
    FileText,
    GraduationCap,
    Link as LinkIcon,
    MapPin,
    Mic,
    Quote,
    Sparkles,
} from "lucide-vue-next";

const props = defineProps<{
    open: boolean;
    payload: SearchPayload | null;
}>();

const emit = defineEmits<{
    "update:open": [value: boolean];
}>();

const isOpen = computed(
    {
        get: () => props.open,
        set: (v) => emit("update:open", v),
    },
);

const header = computed(() => DetailView.headerFor(props.payload));

const kindIcon = computed(() => {
    switch (header.value?.kind) {
        case "work":
            return BookOpen;

        case "project":
            return FileText;

        case "skill":
            return Sparkles;

        case "education":
            return GraduationCap;

        case "talk":
            return Mic;

        case "recommendation":
            return Quote;

        case "link":
            return LinkIcon;

        default:
            return BookOpen;
    }
});
</script>

<template>
    <Sheet v-model:open="isOpen">
        <SheetContent
            side="right"
            class="w-full sm:max-w-xl overflow-y-auto bg-card border-l border-border"
        >
            <SheetHeader class="gap-1.5 px-6 pt-6">
                <div
                    class="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground"
                >
                    <component :is="kindIcon" class="size-3.5" />
                    <span>{{ payload?.kind }}</span>
                </div>
                <div v-if="header?.avatar" class="flex items-center gap-3 pt-1">
                    <div
                        class="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border bg-muted"
                    >
                        <img
                            :src="header.avatar.src"
                            :alt="header.avatar.alt"
                            class="h-full w-full object-cover"
                            width="48"
                            height="48"
                            loading="lazy"
                            decoding="async"
                            referrerpolicy="no-referrer"
                        />
                    </div>
                    <SheetTitle class="text-2xl font-semibold tracking-tight">
                        {{ header.title }}
                    </SheetTitle>
                </div>
                <SheetTitle v-else class="text-2xl font-semibold tracking-tight">
                    {{ header?.title }}
                </SheetTitle>
                <SheetDescription class="text-sm text-muted-foreground">
                    {{ header?.description }}
                </SheetDescription>
            </SheetHeader>

            <div class="px-6 pb-8 pt-2 text-[15px] leading-relaxed text-foreground/90 space-y-4">
                <template v-if="payload?.kind === 'Work'">
                    <p
                        v-for="(para, i) in DetailView.paragraphs(payload.data.summary)"
                        :key="i"
                        class="whitespace-pre-line"
                    >
                        {{ para }}
                    </p>
                    <div v-if="payload.data.skills" class="pt-4 border-t border-border">
                        <h3 class="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                            Skills
                        </h3>
                        <div class="flex flex-wrap gap-2">
                            <span
                                v-for="skill in DetailView.commaList(payload.data.skills)"
                                :key="skill"
                                class="pill"
                            >
                                {{ skill }}
                            </span>
                        </div>
                    </div>
                </template>

                <template v-else-if="payload?.kind === 'Project'">
                    <p class="whitespace-pre-line">{{ payload.data.excerpt }}</p>
                    <div class="flex items-center gap-4 pt-4 border-t border-border text-sm">
                        <div class="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar class="size-3.5" />
                            <span>{{ payload.data.published_at }}</span>
                        </div>
                        <a
                            :href="UrlGuard.safeHref(payload.data.url)"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-1.5 text-foreground hover:underline"
                        >
                            <LinkIcon class="size-3.5" />
                            <span>View repository</span>
                        </a>
                    </div>
                </template>

                <template v-else-if="payload?.kind === 'Skill'">
                    <p>{{ payload.data.description }}</p>
                    <div class="pt-4 border-t border-border">
                        <h3 class="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                            Proficiency
                        </h3>
                        <div class="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div
                                class="h-full bg-foreground transition-all"
                                :style="{ width: `${payload.data.percentage}%` }"
                            />
                        </div>
                        <p class="mt-2 text-sm text-muted-foreground">
                            {{ payload.data.percentage }}%
                        </p>
                    </div>
                </template>

                <template v-else-if="payload?.kind === 'Education'">
                    <p class="whitespace-pre-line">
                        {{ TextFormatter.stripHtml(payload.data.description) }}
                    </p>
                </template>

                <template v-else-if="payload?.kind === 'Talk'">
                    <p class="text-base">{{ payload.data.subject }}</p>
                    <div class="flex items-center gap-4 pt-4 border-t border-border text-sm">
                        <div class="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin class="size-3.5" />
                            <span>{{ payload.data.location }}</span>
                        </div>
                        <div class="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar class="size-3.5" />
                            <span>{{ payload.data.created_at }}</span>
                        </div>
                        <a
                            :href="UrlGuard.safeHref(payload.data.url)"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-1.5 text-foreground hover:underline"
                        >
                            <LinkIcon class="size-3.5" />
                            <span>Watch talk</span>
                        </a>
                    </div>
                </template>

                <template v-else-if="payload?.kind === 'Recommendation'">
                    <p class="whitespace-pre-line italic">
                        "{{ TextFormatter.stripHtml(payload.data.text) }}"
                    </p>
                    <p class="pt-4 border-t border-border text-sm text-muted-foreground">
                        {{ payload.data.relation }}
                    </p>
                </template>

                <template v-else-if="payload?.kind === 'Link'">
                    <p class="text-muted-foreground">{{ payload.data.description }}</p>
                    <a
                        :href="UrlGuard.safeHref(payload.data.url)"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-1.5 text-foreground hover:underline"
                    >
                        <LinkIcon class="size-3.5" />
                        <span>Open {{ payload.data.url }}</span>
                    </a>
                </template>
            </div>
        </SheetContent>
    </Sheet>
</template>
