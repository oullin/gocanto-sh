<script setup lang="ts">
import { computed, ref, type Component } from "vue";
import { profile, type ProfileSkillRecord } from "@gocanto/store";
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
import { ScrollFade } from "@/components/ui/scroll-fade";

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

type Cell = {
    skill: ProfileSkillRecord;
    title: string;
    description: string;
    icon: Component | null;
    initials: string;
};

function toCell(s: ProfileSkillRecord): Cell {
    const icon = iconFor[s.item] ?? null;

    return {
        skill: s,
        title: s.item,
        description: s.description,
        icon: icon,
        initials: initials(s.item),
    };
}

const signatureCells = computed<Cell[]>(() =>
    skills.filter((s) => s.signature === true).map(toCell),
);

const moreCells = computed<Cell[]>(() => skills.filter((s) => s.signature !== true).map(toCell));

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
    <section id="skills" ref="section" class="frame-section">
        <div class="explore-head">
            <h2>Signature skills</h2>
            <p>
                Hands-on craft I lean on across every engagement — agentic platforms, payment cores,
                streaming pipelines, banking legacy.
            </p>
        </div>

        <div class="explore-grid">
            <button
                v-for="c in signatureCells"
                :key="c.skill.uuid"
                type="button"
                class="explore-card"
                :aria-busy="!ready"
                @click="openSkill(c.skill)"
            >
                <span
                    class="explore-card__icon"
                    :class="{ 'explore-card__icon--loading': !ready }"
                    aria-hidden="true"
                >
                    <component :is="c.icon ?? Sparkles" :size="16" :stroke-width="1.5" />
                </span>
                <h3>
                    <span :class="{ 'sk-shimmer': !ready }">{{ c.title }}</span>
                </h3>
                <p>
                    <span :class="{ 'sk-shimmer': !ready }">{{ c.description }}</span>
                </p>
                <span v-if="c.skill.years" class="explore-card__years" aria-label="Years hands-on">
                    {{ c.skill.years }} yrs
                </span>
            </button>
        </div>

        <div class="explore-subhead">
            <h3>More skills</h3>
            <p>
                Languages, frameworks, and practices I draw on day-to-day. Click any card for the
                full detail.
            </p>
        </div>

        <ScrollFade class="explore-scroll">
            <div ref="moreSection" class="explore-grid explore-grid--dense">
                <button
                    v-for="c in moreCells"
                    :key="c.skill.uuid"
                    type="button"
                    class="explore-card explore-card--compact"
                    :aria-busy="!moreReady"
                    @click="openSkill(c.skill)"
                >
                    <span
                        class="explore-card__icon"
                        :class="{ 'explore-card__icon--loading': !moreReady }"
                        aria-hidden="true"
                    >
                        <component v-if="c.icon" :is="c.icon" :size="16" :stroke-width="1.5" />
                        <span v-else class="explore-card__initials">{{ c.initials }}</span>
                    </span>
                    <h3>
                        <span :class="{ 'sk-shimmer': !moreReady }">{{ c.title }}</span>
                    </h3>
                    <p>
                        <span :class="{ 'sk-shimmer': !moreReady }">{{ c.description }}</span>
                    </p>
                    <span
                        v-if="c.skill.years"
                        class="explore-card__years explore-card__years--muted"
                        aria-label="Years hands-on"
                    >
                        {{ c.skill.years }} yrs
                    </span>
                </button>
            </div>
        </ScrollFade>

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
                        <span v-if="activeSkill?.signature" class="skill-sheet__badge"
                            >Signature</span
                        >
                    </div>
                    <SheetTitle>{{ activeSkill?.item }}</SheetTitle>
                    <SheetDescription>{{ activeSkill?.description }}</SheetDescription>
                </SheetHeader>

                <div v-if="activeSkill" class="skill-sheet__body">
                    <div class="skill-sheet__meter" aria-label="Proficiency">
                        <div class="skill-sheet__meter-head">
                            <span>Proficiency</span>
                            <span class="skill-sheet__meter-value"
                                >{{ activeSkill.percentage }}%</span
                            >
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
