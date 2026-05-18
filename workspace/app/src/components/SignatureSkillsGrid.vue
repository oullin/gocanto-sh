<script setup lang="ts">
import { computed, ref, type Component } from "vue";
import { profile, projects, type ProfileSkillRecord, type ProjectRecord } from "@gocanto/store";
import { useInViewReady } from "@lib/useAsyncInView";
import {
    Binary,
    Server,
    Workflow,
    CreditCard,
    Waypoints,
    Users,
    Layers,
    ShoppingCart,
    Brain,
    Sparkles,
    ExternalLink,
    ArrowUpRight,
} from "lucide-vue-next";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

const section = ref<HTMLElement | null>(null);
const moreSection = ref<HTMLElement | null>(null);

const skills: readonly ProfileSkillRecord[] = profile.data.skills;

const iconFor: Record<string, Component> = {
    Leadership: Users,
    "System Design": Layers,
    "E-commerce Architecture": ShoppingCart,
    "Go (Programming Language)": Binary,
    "AI (Artificial Intelligence)": Brain,
    "AS/400 Modernisation": Server,
    "Agentic Orchestration": Workflow,
    "Payment Integration": CreditCard,
    "Kafka Event Pipelines": Waypoints,
};

function initials(title: string): string {
    const words = title
        .replace(/[()/.,]/g, " ")
        .trim()
        .split(/\s+/);

    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
}

const CHIP_VARIANTS = ["green", "blue", "purple", "amber"] as const;

function chipVariant(name: string): string {
    let hash = 0;

    for (let i = 0; i < name.length; i++) {
        hash = (hash * 31 + name.charCodeAt(i)) | 0;
    }

    return CHIP_VARIANTS[Math.abs(hash) % CHIP_VARIANTS.length];
}

type SmallSkill = {
    skill: ProfileSkillRecord;
    badge: string;
    short: string;
};

const SMALL_DESC_MAX = 90;

const truncate = (text: string, max: number): string => {
    if (text.length <= max) {
        return text;
    }
    const slice = text.slice(0, max);
    const lastSpace = slice.lastIndexOf(" ");
    return `${slice.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
};

const signatureSkills = computed<ProfileSkillRecord[]>(() =>
    skills.filter((s) => s.signature === true),
);

const moreSkills = computed<SmallSkill[]>(() =>
    skills
        .filter((s) => s.signature !== true)
        .map((s) => ({
            skill: s,
            badge: initials(s.item),
            short: truncate(s.description, SMALL_DESC_MAX),
        })),
);

const PROJ_LANG_CLASS: Record<string, string> = {
    Go: "go",
    "Go / Docker": "go",
    "Vue / TypeScript": "vue",
    Vue: "vue",
    PHP: "php",
    "PHP / Vue": "vue",
};

const langClass = (lang: string): string => {
    if (PROJ_LANG_CLASS[lang]) {
        return PROJ_LANG_CLASS[lang];
    }
    const lower = lang.toLowerCase();
    if (lower.startsWith("go")) {
        return "go";
    }
    if (lower.includes("vue")) {
        return "vue";
    }
    if (lower.includes("php")) {
        return "php";
    }
    return "";
};

const projShort = (text: string): string => {
    const cleaned = text.split(".")[0];
    return truncate(cleaned, 60);
};

const openSourceProjects: ProjectRecord[] = [...projects.data]
    .filter((p) => p.is_open_source)
    .sort((a, b) => a.sort - b.sort)
    .slice(0, 6);

const ready = useInViewReady(section);
const moreReady = useInViewReady(moreSection);

const open = ref(false);
const activeSkill = ref<ProfileSkillRecord | null>(null);

function openSkill(s: ProfileSkillRecord) {
    activeSkill.value = s;
    open.value = true;
}

const activeIcon = computed<Component>(() => {
    const s = activeSkill.value;
    if (!s) {
        return Sparkles;
    }
    return iconFor[s.item] ?? Sparkles;
});

const activeHasIcon = computed<boolean>(() => {
    const s = activeSkill.value;
    return !!s && !!iconFor[s.item];
});
</script>

<template>
    <section id="skills" ref="section">
        <div class="skills-head">
            <div>
                <span class="kicker">The technical part · For engineers and CTOs</span>
                <h2>Signature skills</h2>
            </div>
            <span class="for-techies">Buzzword zone · for people who want the specifics</span>
        </div>

        <div class="skill-grid">
            <button
                v-for="s in signatureSkills"
                :key="s.uuid"
                type="button"
                class="skill"
                :aria-busy="!ready"
                @click="openSkill(s)"
            >
                <div class="skill-top">
                    <component
                        :is="iconFor[s.item] ?? Sparkles"
                        class="ico"
                        :size="22"
                        :stroke-width="1.6"
                        aria-hidden="true"
                    />
                    <span v-if="s.years" class="yrs">
                        <span :class="{ 'sk-shimmer': !ready }">{{ s.years }} yrs</span>
                    </span>
                </div>
                <h4><span :class="{ 'sk-shimmer': !ready }">{{ s.item }}</span></h4>
                <p><span :class="{ 'sk-shimmer': !ready }">{{ s.description }}</span></p>
            </button>
        </div>

        <h3 class="skills-extra-head">More skills</h3>
        <p class="skills-extra-sub">
            Languages, frameworks, and practices I draw on day-to-day. Click any card for the full
            detail.
        </p>

        <div ref="moreSection" class="small-skills">
            <button
                v-for="m in moreSkills"
                :key="m.skill.uuid"
                type="button"
                class="small"
                :aria-busy="!moreReady"
                @click="openSkill(m.skill)"
            >
                <div class="badge mono">
                    <span :class="{ 'sk-shimmer': !moreReady }">{{ m.badge }}</span>
                </div>
                <h5><span :class="{ 'sk-shimmer': !moreReady }">{{ m.skill.item }}</span></h5>
                <p><span :class="{ 'sk-shimmer': !moreReady }">{{ m.short }}</span></p>
            </button>
        </div>

        <h3 id="projects" class="skills-extra-head">Open source</h3>
        <p class="skills-extra-sub">
            A few small projects I maintain in public.
            <a href="https://github.com/gocanto" target="_blank" rel="noopener noreferrer">Full list on GitHub →</a>
        </p>
        <div class="proj-strip">
            <a
                v-for="p in openSourceProjects"
                :key="p.uuid"
                :href="p.url"
                target="_blank"
                rel="noopener noreferrer"
                class="proj"
            >
                <span class="name">{{ p.title }}</span>
                <span class="desc">{{ projShort(p.excerpt) }}</span>
                <span class="lang" :class="langClass(p.language)">{{ p.language }}</span>
            </a>
        </div>

        <Sheet v-model:open="open">
            <SheetContent class="skill-sheet" side="right">
                <SheetHeader>
                    <div class="skill-sheet__head">
                        <span class="skill-sheet__icon" aria-hidden="true">
                            <component
                                v-if="activeHasIcon"
                                :is="activeIcon"
                                :size="18"
                                :stroke-width="1.5"
                            />
                            <span v-else class="skill-sheet__initials">{{
                                activeSkill ? initials(activeSkill.item) : ""
                            }}</span>
                        </span>
                        <span v-if="activeSkill?.signature" class="skill-sheet__badge">Signature</span>
                    </div>
                    <SheetTitle>{{ activeSkill?.item }}</SheetTitle>
                    <SheetDescription>{{ activeSkill?.description }}</SheetDescription>
                </SheetHeader>

                <div v-if="activeSkill" class="skill-sheet__body">
                    <div class="skill-sheet__meter" aria-label="Proficiency">
                        <div class="skill-sheet__meter-head">
                            <span>Proficiency</span>
                            <span class="skill-sheet__meter-value">{{ activeSkill.percentage }}%</span>
                        </div>
                        <div
                            class="skill-sheet__bar"
                            role="progressbar"
                            :aria-valuenow="activeSkill.percentage"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                            <span
                                class="skill-sheet__bar-fill"
                                :style="{ width: activeSkill.percentage + '%' }"
                            />
                        </div>
                    </div>

                    <p v-if="activeSkill.long_description" class="skill-sheet__long">
                        {{ activeSkill.long_description }}
                    </p>

                    <div v-if="activeSkill.years" class="skill-sheet__row">
                        <span class="skill-sheet__label">Years hands-on</span>
                        <span class="skill-sheet__value">{{ activeSkill.years }}</span>
                    </div>

                    <div
                        v-if="activeSkill.related_tech && activeSkill.related_tech.length"
                        class="skill-sheet__section"
                    >
                        <span class="skill-sheet__label">Related tech</span>
                        <ul class="skill-sheet__chips">
                            <li
                                v-for="t in activeSkill.related_tech"
                                :key="t"
                                class="skill-sheet__chip"
                                :class="`skill-sheet__chip--${chipVariant(t)}`"
                            >
                                {{ t }}
                            </li>
                        </ul>
                    </div>

                    <div
                        v-if="activeSkill.example_projects && activeSkill.example_projects.length"
                        class="skill-sheet__section"
                    >
                        <span class="skill-sheet__label">Example projects</span>
                        <ul class="skill-sheet__projects">
                            <li v-for="(p, i) in activeSkill.example_projects" :key="i">
                                <a
                                    v-if="typeof p === 'object' && p.url"
                                    class="skill-sheet__project"
                                    :href="p.url"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span>{{ p.title }}</span>
                                    <ExternalLink
                                        class="skill-sheet__project-icon"
                                        :size="14"
                                        :stroke-width="1.5"
                                        aria-hidden="true"
                                    />
                                </a>
                                <button
                                    v-else
                                    type="button"
                                    class="skill-sheet__project"
                                    :title="typeof p === 'string' ? p : p.title"
                                >
                                    <span>{{ typeof p === "string" ? p : p.title }}</span>
                                    <ArrowUpRight
                                        class="skill-sheet__project-icon"
                                        :size="14"
                                        :stroke-width="1.5"
                                        aria-hidden="true"
                                    />
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    </section>
</template>
