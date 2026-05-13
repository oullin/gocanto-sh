<script setup lang="ts">
import { ref } from "vue";
import { profile } from "@gocanto/data";
import { CornerDownLeft, Plus, Sparkles, User } from "lucide-vue-next";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncInView } from "@lib/useAsyncInView";

type Topic = { title: string; description: string; illo: "ai" | "backend" | "security" };

const section = ref<HTMLElement | null>(null);

const placeholders: Topic[] = [
    { title: "", description: "", illo: "ai" },
    { title: "", description: "", illo: "backend" },
    { title: "", description: "", illo: "security" },
];

const topics = useAsyncInView<Topic[]>(section, () => {
    const findSkill = (name: string) =>
        profile.data.skills.find((s) => s.item === name);
    return [
        {
            title: "AI",
            description: findSkill("AI (Artificial Intelligence)")?.description ?? "",
            illo: "ai",
        },
        {
            title: "Backend",
            description: findSkill("System Design")?.description ?? "",
            illo: "backend",
        },
        {
            title: "Integrations",
            description: findSkill("Complex 3rd Party System Integrations")?.description ?? "",
            illo: "security",
        },
    ];
});

const backendTiles = ["py", "ex", "fl", "ne", "el", "N", "so", "bn", "sl"];
</script>

<template>
    <section ref="section" class="topics frame-section">
        <a
            v-for="(t, i) in (topics ?? placeholders)"
            :key="`${t.illo}-${i}`"
            :href="topics ? '#' : undefined"
            class="topic-card"
            :aria-busy="!topics"
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
                    <template v-if="topics">{{ t.title }}</template>
                    <Skeleton v-else class="h-5 w-1/3 inline-block align-middle" />
                </h3>
                <p>
                    <template v-if="topics">{{ t.description }}</template>
                    <span v-else class="topic-skeleton">
                        <Skeleton class="h-4 w-full mb-1.5" />
                        <Skeleton class="h-4 w-4/5" />
                    </span>
                </p>
            </div>
        </a>
    </section>
</template>

<style scoped>
.topic-skeleton {
    display: block;
}
</style>
