<script setup lang="ts">
import { computed } from "vue";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
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
import type {
    EducationRecord,
    ExperienceRecord,
    LinkRecord,
    ProfileSkillRecord,
    ProjectRecord,
    RecommendationRecord,
    TalkRecord,
} from "@gocanto/store";

export type SearchPayload =
    | { kind: "Work"; data: ExperienceRecord }
    | { kind: "Project"; data: ProjectRecord }
    | { kind: "Skill"; data: ProfileSkillRecord }
    | { kind: "Education"; data: EducationRecord }
    | { kind: "Talk"; data: TalkRecord }
    | { kind: "Recommendation"; data: RecommendationRecord }
    | { kind: "Link"; data: LinkRecord };

const props = defineProps<{
    open: boolean;
    payload: SearchPayload | null;
}>();

const emit = defineEmits<{
    "update:open": [value: boolean];
}>();

const isOpen = computed({
    get: () => props.open,
    set: (v) => emit("update:open", v),
});

const sanitize = (html: string) =>
    html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "");

const kindIcon = computed(() => {
    switch (props.payload?.kind) {
        case "Work":
            return BookOpen;
        case "Project":
            return FileText;
        case "Skill":
            return Sparkles;
        case "Education":
            return GraduationCap;
        case "Talk":
            return Mic;
        case "Recommendation":
            return Quote;
        case "Link":
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
                <div class="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                    <component :is="kindIcon" class="size-3.5" />
                    <span>{{ payload?.kind }}</span>
                </div>
                <div
                    v-if="payload?.kind === 'Recommendation'"
                    class="flex items-center gap-3 pt-1"
                >
                    <div class="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                        <img
                            :src="`https://oullin.io/images/${payload.data.person.avatar}`"
                            :alt="payload.data.person.full_name"
                            class="h-full w-full object-cover"
                            loading="lazy"
                            referrerpolicy="no-referrer"
                        />
                    </div>
                    <SheetTitle class="text-2xl font-semibold tracking-tight">
                        {{ payload.data.person.full_name }}
                    </SheetTitle>
                </div>
                <SheetTitle v-else class="text-2xl font-semibold tracking-tight">
                    <template v-if="payload?.kind === 'Work'">
                        {{ payload.data.position }} · {{ payload.data.company }}
                    </template>
                    <template v-else-if="payload?.kind === 'Project'">
                        {{ payload.data.title }}
                    </template>
                    <template v-else-if="payload?.kind === 'Skill'">
                        {{ payload.data.item }}
                    </template>
                    <template v-else-if="payload?.kind === 'Education'">
                        {{ payload.data.degree }} · {{ payload.data.field }}
                    </template>
                    <template v-else-if="payload?.kind === 'Talk'">
                        {{ payload.data.title }}
                    </template>
                    <template v-else-if="payload?.kind === 'Link'">
                        {{ payload.data.name }}
                    </template>
                </SheetTitle>
                <SheetDescription class="text-sm text-muted-foreground">
                    <template v-if="payload?.kind === 'Work'">
                        {{ payload.data.start_date }} – {{ payload.data.end_date }} · {{ payload.data.employment_type }} · {{ payload.data.city }}, {{ payload.data.country }}
                    </template>
                    <template v-else-if="payload?.kind === 'Project'">
                        {{ payload.data.language }}<span v-if="payload.data.is_open_source"> · Open source</span>
                    </template>
                    <template v-else-if="payload?.kind === 'Skill'">
                        Proficiency {{ payload.data.percentage }}%
                    </template>
                    <template v-else-if="payload?.kind === 'Education'">
                        {{ payload.data.school }} · Graduated {{ payload.data.graduated_at }} · {{ payload.data.issuing_country }}
                    </template>
                    <template v-else-if="payload?.kind === 'Talk'">
                        {{ payload.data.subject }} · {{ payload.data.location }}
                    </template>
                    <template v-else-if="payload?.kind === 'Recommendation'">
                        {{ payload.data.person.designation }} · {{ payload.data.person.company }}
                    </template>
                    <template v-else-if="payload?.kind === 'Link'">
                        {{ payload.data.handle }}
                    </template>
                </SheetDescription>
            </SheetHeader>

            <div class="px-6 pb-8 pt-2 text-[15px] leading-relaxed text-foreground/90 space-y-4">
                <template v-if="payload?.kind === 'Work'">
                    <p v-for="(para, i) in sanitize(payload.data.summary).split('\n\n').filter(Boolean)" :key="i" class="whitespace-pre-line">
                        {{ para }}
                    </p>
                    <div v-if="payload.data.skills" class="pt-4 border-t border-border">
                        <h3 class="text-xs uppercase tracking-wide text-muted-foreground mb-3">Skills</h3>
                        <div class="flex flex-wrap gap-2">
                            <span
                                v-for="skill in payload.data.skills.split(',').map((s) => s.trim()).filter(Boolean)"
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
                            :href="payload.data.url"
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
                        <h3 class="text-xs uppercase tracking-wide text-muted-foreground mb-3">Proficiency</h3>
                        <div class="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div
                                class="h-full bg-foreground transition-all"
                                :style="{ width: `${payload.data.percentage}%` }"
                            />
                        </div>
                        <p class="mt-2 text-sm text-muted-foreground">{{ payload.data.percentage }}%</p>
                    </div>
                </template>

                <template v-else-if="payload?.kind === 'Education'">
                    <p class="whitespace-pre-line">{{ sanitize(payload.data.description) }}</p>
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
                            :href="payload.data.url"
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
                    <p class="whitespace-pre-line italic">"{{ sanitize(payload.data.text) }}"</p>
                    <p class="pt-4 border-t border-border text-sm text-muted-foreground">
                        {{ payload.data.relation }}
                    </p>
                </template>

                <template v-else-if="payload?.kind === 'Link'">
                    <p class="text-muted-foreground">{{ payload.data.description }}</p>
                    <a
                        :href="payload.data.url"
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
