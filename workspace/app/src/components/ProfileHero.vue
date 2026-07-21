<script setup lang="ts">
import { ref } from "vue";
import { profile } from "@gocanto/store";
import { useInViewReady } from "#app/lib/useAsyncInView";

const section = ref<HTMLElement | null>(null);

const name = profile.data.name;

const ready = useInViewReady(section);
</script>

<template>
    <header id="about" ref="section" class="hero">
        <h1 class="name">
            <span :class="{ 'sk-shimmer': !ready }">{{ name }}</span>
        </h1>
        <p class="lede">
            <span :class="{ 'sk-shimmer': !ready }">
                <span class="em">Software engineer for 20 years.</span> I build the systems that
                move money, run online stores, and now power the new wave of AI assistants: the kind
                that take real actions, not just answer questions.
            </span>
        </p>
    </header>
</template>
