<script setup lang="ts">
import { ref } from "vue";
import { profile, type ProfileSkillRecord } from "@gocanto/data";
import { useInViewReady } from "@lib/useAsyncInView";

const PLACEHOLDER_COUNT = 6;

const section = ref<HTMLElement | null>(null);

const skills: readonly ProfileSkillRecord[] = profile.data.skills;

const cells = skills
    .filter((s) => s.signature === true)
    .slice(0, PLACEHOLDER_COUNT)
    .map((s) => ({ title: s.item, description: s.description }));

const ready = useInViewReady(section);
</script>

<template>
    <section ref="section" class="frame-section">
        <div class="explore-head">
            <h2>Signature skills</h2>
            <p>Hands-on craft I lean on across every engagement — agentic platforms, payment cores, streaming pipelines, banking legacy.</p>
        </div>
        <div class="explore-grid">
            <a
                v-for="c in cells"
                :key="c.title"
                :href="ready ? '#' : undefined"
                class="explore-card"
                :aria-busy="!ready"
            >
                <h3>
                    <span :class="{ 'sk-shimmer': !ready }">{{ c.title }}</span>
                </h3>
                <p>
                    <span :class="{ 'sk-shimmer': !ready }">{{ c.description }}</span>
                </p>
            </a>
        </div>
    </section>
</template>
