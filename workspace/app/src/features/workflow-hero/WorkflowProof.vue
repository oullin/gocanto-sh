<script setup lang="ts">
import type { ProofAvatar } from "#app/features/workflow-hero";

defineProps<{
    avatars: readonly ProofAvatar[];
    loaded: boolean;
    skeletons: readonly number[];
    testimonialCount: number;
}>();
</script>

<template>
    <div class="wf-proof">
        <a
            href="#testimonials"
            class="wf-proof__users"
            aria-label="View testimonials"
            :aria-busy="loaded ? undefined : 'true'"
        >
            <ul class="wf-proof__avatars" aria-label="Testimonials">
                <template v-if="!loaded">
                    <li
                        v-for="index in skeletons"
                        :key="'proof-skeleton-' + index"
                        class="wf-proof__avatar wf-proof__avatar--skeleton"
                        aria-hidden="true"
                    />
                </template>
                <template v-else>
                    <li v-for="avatar in avatars" :key="avatar.src" class="wf-proof__avatar">
                        <img
                            :src="avatar.src"
                            :alt="avatar.alt"
                            width="36"
                            height="36"
                            loading="lazy"
                            decoding="async"
                            referrerpolicy="no-referrer"
                        />
                    </li>
                </template>
            </ul>
            <span v-if="!loaded" class="wf-proof__label-skeleton" aria-hidden="true" />
            <span v-else
                ><strong>{{ testimonialCount }}+</strong> Testimonials</span
            >
        </a>
    </div>
</template>
