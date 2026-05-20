<script setup lang="ts">
import { computed, ref, type Component } from "vue";
import {
    iconKeyForSkill,
    listSignatureSkillCells,
    listSupportingSkillCells,
    skillChipVariant,
    skillInitials,
} from "@gocanto/domain";
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

const iconFor: Record<string, Component> = {
    users: Users,
    layers: Layers,
    "shopping-cart": ShoppingCart,
    binary: Binary,
    brain: Brain,
    server: Server,
    workflow: Workflow,
    "credit-card": CreditCard,
    waypoints: Waypoints,
};

const signatureCells = computed(() => listSignatureSkillCells(profile));
const moreCells = computed(() => listSupportingSkillCells(profile));

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

    const iconKey = iconKeyForActiveSkill(s);

    return iconKey ? iconFor[iconKey] : Sparkles;
});

const activeHasIcon = computed<boolean>(() => {
    const s = activeSkill.value;

    return !!s && !!iconKeyForActiveSkill(s);
});

function iconKeyForActiveSkill(skill: ProfileSkillRecord): string | null {
    return iconKeyForSkill(skill.item);
}
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
                    <component
                        :is="c.iconKey ? iconFor[c.iconKey] : Sparkles"
                        :size="16"
                        :stroke-width="1.5"
                    />
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
                        <component
                            v-if="c.iconKey"
                            :is="iconFor[c.iconKey]"
                            :size="16"
                            :stroke-width="1.5"
                        />
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
                                activeSkill ? skillInitials(activeSkill.item) : ""
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
                                :class="`skill-sheet__chip--${skillChipVariant(t)}`"
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
