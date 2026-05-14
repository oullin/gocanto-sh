<script setup lang="ts">
import { Star } from "lucide-vue-next";
import { cn } from "@lib/utils";
import type { Testimonial } from "./types";

defineProps<{
    item: Testimonial;
    interactive: boolean;
    loading: boolean;
    cardClass: string;
}>();

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
        :tabindex="interactive ? undefined : -1"
        @click="interactive && !loading ? $emit('select', item) : undefined"
    >
        <div
            v-if="interactive && !loading"
            :class="cn(
                'absolute inset-0 bg-gradient-to-br from-black/[0.02] dark:from-white/5 to-transparent opacity-0 transition-opacity group-hover/card:opacity-100',
            )"
        />
        <span v-if="item.featured && !loading" class="tm-featured-badge">
            <Star class="size-3 fill-current" :stroke-width="0" />
            <span>Featured</span>
        </span>
        <div class="relative z-10 flex flex-1 flex-col gap-4 overflow-hidden">
            <p class="text-sm leading-relaxed text-muted-foreground line-clamp-5 whitespace-pre-line">
                <span :class="{ 'sk-shimmer': loading }">{{ item.text }}</span>
            </p>
        </div>
        <div class="relative z-10 flex items-center gap-3 pt-3">
            <div class="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                <div v-if="loading" class="tm-avatar-skeleton h-full w-full" />
                <img
                    v-else
                    :src="item.avatar"
                    :alt="interactive ? item.name : ''"
                    class="h-full w-full object-cover"
                    loading="lazy"
                    referrerpolicy="no-referrer"
                />
            </div>
            <div class="flex min-w-0 flex-col gap-1">
                <span class="truncate text-sm font-medium text-foreground">
                    <span :class="{ 'sk-shimmer': loading }">{{ item.name }}</span>
                </span>
                <span v-if="item.role || item.company" class="truncate text-xs text-muted-foreground">
                    <span :class="{ 'sk-shimmer': loading }">
                        {{ item.role }}<template v-if="item.role && item.company"> · </template>{{ item.company }}
                    </span>
                </span>
            </div>
        </div>
    </component>
</template>
