<script setup lang="ts">
import { ref } from "vue";
import { profile } from "@gocanto/data";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncInView } from "@lib/useAsyncInView";

const section = ref<HTMLElement | null>(null);

const heroData = useAsyncInView(
    section,
    () => ({
        name: profile.data.name,
        profession: profile.data.profession,
    }),
);
</script>

<template>
    <section ref="section" class="profile-hero frame-section">
        <h1>
            <template v-if="heroData">{{ heroData.name }}</template>
            <Skeleton v-else class="profile-hero__h1-skeleton" />
        </h1>
        <p>
            <template v-if="heroData">{{ heroData.profession }} — production-grade backends, agent-accelerated. For fintech, banking, and e-commerce.</template>
            <span v-else class="profile-hero__p-skeleton">
                <Skeleton class="h-4 w-full mb-2" />
                <Skeleton class="h-4 w-4/5 mx-auto" />
            </span>
        </p>
    </section>
</template>

<style scoped>
.profile-hero__h1-skeleton {
    display: inline-block;
    height: clamp(40px, 5.5vw, 56px);
    width: min(420px, 70%);
    vertical-align: middle;
}
.profile-hero__p-skeleton {
    display: block;
    max-width: 60ch;
    margin-inline: auto;
}
</style>
