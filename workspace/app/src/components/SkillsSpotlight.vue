<script setup lang="ts">
import { ref } from "vue";
import { profile } from "@gocanto/data";
import { CornerDownLeft, Plus, Sparkles, User } from "lucide-vue-next";
import { useInViewReady } from "@lib/useAsyncInView";

type Topic = { title: string; description: string; illo: "ai" | "backend" | "security" };

const section = ref<HTMLElement | null>(null);

const findSkill = (name: string) =>
    profile.data.skills.find((s) => s.item === name);

const topics: Topic[] = [
    {
        title: "Agentic",
        description: findSkill("Agentic Orchestration")?.description ?? "",
        illo: "ai",
    },
    {
        title: "Payments",
        description: findSkill("Payment Integration")?.description ?? "",
        illo: "security",
    },
    {
        title: "Pipelines",
        description: findSkill("Kafka Event Pipelines")?.description ?? "",
        illo: "backend",
    },
];

const ready = useInViewReady(section);

const backendTiles = ["py", "ex", "fl", "ne", "el", "N", "so", "bn", "sl"];
</script>

<template>
    <section ref="section" class="topics frame-section">
        <a
            v-for="(t, i) in topics"
            :key="`${t.illo}-${i}`"
            :href="ready ? '#' : undefined"
            class="topic-card"
            :aria-busy="!ready"
        >
            <div class="topic-illo" :class="t.illo">
                <template v-if="t.illo === 'ai'">
                    <div class="ai-avatar">
                        <User :size="14" :stroke-width="1.5" />
                    </div>
                    <div class="ai-bubble ai-bubble-short"></div>
                    <div class="ai-bubble ai-bubble-long"></div>
                    <div class="ai-sparkle">
                        <Sparkles :size="14" :stroke-width="1.5" />
                    </div>
                    <div class="ai-input">
                        <span class="ai-input-plus">
                            <Plus :size="12" :stroke-width="1.5" />
                        </span>
                        <span class="ai-input-enter">
                            <CornerDownLeft :size="12" :stroke-width="1.5" />
                        </span>
                    </div>
                </template>
                <template v-else-if="t.illo === 'backend'">
                    <div class="backend-grid">
                        <div v-for="(tile, j) in backendTiles" :key="j" class="backend-tile">
                            <span>{{ tile }}</span>
                        </div>
                    </div>
                </template>
                <template v-else-if="t.illo === 'security'">
                    <div class="security-window">
                        <div class="security-titlebar">
                            <span></span><span></span><span></span>
                        </div>
                        <div class="security-body"></div>
                    </div>
                </template>
            </div>
            <div class="topic-body">
                <h3>
                    <span :class="{ 'sk-shimmer': !ready }">{{ t.title }}</span>
                </h3>
                <p>
                    <span :class="{ 'sk-shimmer': !ready }">{{ t.description }}</span>
                </p>
            </div>
        </a>
    </section>
</template>
