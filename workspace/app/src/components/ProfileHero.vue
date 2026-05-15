<script setup lang="ts">
import { ref } from "vue";
import { profile } from "@gocanto/store";
import { useInViewReady } from "@lib/useAsyncInView";

const section = ref<HTMLElement | null>(null);

const name = profile.data.name;
const profession = profile.data.profession;
const paragraph = `${profession} — 20 years shipping regulated backends. Now architecting AI-agentic systems in Go, and founder of Oullin Labs (hara.sh · kuda.sh · toku.sh) for fintech, banking, and e-commerce.`;

const ready = useInViewReady(section);
</script>

<template>
    <section ref="section" class="profile-hero frame-section">
        <h1>
            <span :class="{ 'sk-shimmer': !ready }">{{ name }}</span>
        </h1>
        <p>
            <span :class="{ 'sk-shimmer': !ready }">{{ paragraph }}</span>
        </p>
    </section>
</template>
