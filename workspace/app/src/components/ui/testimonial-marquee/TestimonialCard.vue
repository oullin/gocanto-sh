<script setup lang="ts">
import { Star } from "lucide-vue-next";
import type { Testimonial } from "@components/ui/testimonial-marquee/types";

withDefaults(
    defineProps<{
        item: Testimonial;
        interactive: boolean;
        loading: boolean;
        cardClass: string;
        focusable?: boolean;
    }>(),
    { focusable: true },
);

defineEmits<{
    (e: "select", item: Testimonial): void;
}>();
</script>

<template>
    <component
        :is="interactive ? 'button' : 'div'"
        :type="interactive ? 'button' : undefined"
        :class="cardClass"
        :disabled="interactive ? loading : undefined"
        :aria-busy="interactive && loading ? true : undefined"
        :tabindex="interactive && focusable ? undefined : -1"
        @click="interactive && !loading ? $emit('select', item) : undefined"
    >
        <span v-if="item.featured && !loading" class="tm-featured-badge">
            <Star class="size-3 fill-current" :stroke-width="0" />
            <span>Featured</span>
        </span>
        <div class="tm-card__body relative z-10 flex flex-1 flex-col gap-4 overflow-hidden">
            <p
                class="text-sm leading-relaxed text-muted-foreground line-clamp-5 whitespace-pre-line"
            >
                <span :class="{ 'sk-shimmer': loading }">{{ item.text }}</span>
            </p>
        </div>
        <div class="relative z-10 flex items-center gap-3 pt-3">
            <div
                class="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted"
            >
                <div v-if="loading" class="tm-avatar-skeleton h-full w-full" />
                <img
                    v-else
                    :src="item.avatar"
                    :alt="interactive ? item.name : ''"
                    class="h-full w-full object-cover"
                    width="40"
                    height="40"
                    loading="lazy"
                    decoding="async"
                    referrerpolicy="no-referrer"
                />
            </div>
            <div class="flex min-w-0 flex-col gap-1">
                <span class="truncate text-sm font-medium text-foreground">
                    <span :class="{ 'sk-shimmer': loading }">{{ item.name }}</span>
                </span>
                <span
                    v-if="item.role || item.company"
                    class="truncate text-xs text-muted-foreground"
                >
                    <span :class="{ 'sk-shimmer': loading }">
                        {{ item.role }}<template v-if="item.role && item.company"> · </template
                        >{{ item.company }}
                    </span>
                </span>
            </div>
        </div>
    </component>
</template>

<style scoped>
.tm-featured-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 20;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    border-radius: 999px;
    background: hsl(38 92% 50% / 0.14);
    color: var(--accent-amber);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.04em;
    line-height: 1;
    text-transform: uppercase;
    white-space: nowrap;
}

.tm-card--featured > .tm-card__body {
    padding-top: 20px;
}
</style>
