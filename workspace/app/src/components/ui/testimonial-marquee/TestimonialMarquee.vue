<script setup lang="ts">
import { computed } from "vue";
import { Star } from "lucide-vue-next";
import { cn } from "@lib/utils";

export type Testimonial = {
    id: string;
    name: string;
    text: string;
    avatar: string;
    role?: string;
    company?: string;
    featured?: boolean;
};

const props = withDefaults(
    defineProps<{
        items: readonly Testimonial[];
        speed?: number;
        loading?: boolean;
    }>(),
    { speed: 40, loading: false },
);

const emit = defineEmits<{
    (e: "select", item: Testimonial): void;
}>();

const itemsToDisplay = computed<Testimonial[]>(() => {
    let result = [...props.items];
    while (result.length > 0 && result.length < 10) {
        result = [...result, ...props.items];
    }
    return result;
});

const half = computed(() => Math.ceil(itemsToDisplay.value.length / 2));
const rowOne = computed(() => itemsToDisplay.value.slice(0, half.value));
const rowTwo = computed(() => itemsToDisplay.value.slice(half.value));

const durationStyle = computed(() => ({ "--duration": `${props.speed}s` }));

const cardBase =
    "tm-card group/card relative flex h-[260px] w-[350px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border p-6 text-left transition-all transform-gpu [backface-visibility:hidden]";
const cardSurface = "border-border bg-black/[0.02] dark:bg-white/5";
const cardSurfaceFeatured = "tm-card--featured bg-amber-500/[0.03] dark:bg-amber-400/[0.04]";
const cardInteractiveHover =
    "hover:bg-black/[0.04] dark:hover:bg-white/10 hover:-translate-y-1";
const cardFocus = "focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40";

function cardClass(item: Testimonial, opts: { interactive: boolean }) {
    return cn(
        cardBase,
        item.featured ? cardSurfaceFeatured : cardSurface,
        opts.interactive && (props.loading ? "cursor-default" : cardInteractiveHover),
        opts.interactive && cardFocus,
    );
}

function onCardClick(item: Testimonial) {
    if (props.loading) {return;}
    emit("select", item);
}
</script>

<template>
    <div class="tm-root flex flex-col gap-4 py-8 overflow-hidden" :aria-busy="loading || undefined">
        <div class="tm-row group flex overflow-hidden p-2 [--gap:1rem] [mask-image:linear-gradient(to_right,transparent,#000_48px,#000_calc(100%-48px),transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_48px,#000_calc(100%-48px),transparent)]">
            <div
                :class="cn('tm-track tm-left flex shrink-0 justify-start [gap:var(--gap)] min-w-full pr-[var(--gap)] will-change-transform [backface-visibility:hidden]')"
                :style="durationStyle"
            >
                <button
                    v-for="(item, i) in rowOne"
                    :key="`r1-${i}`"
                    type="button"
                    :class="cardClass(item, { interactive: true })"
                    :disabled="loading"
                    :aria-busy="loading || undefined"
                    @click="onCardClick(item)"
                >
                    <div v-if="!loading" class="absolute inset-0 bg-gradient-to-br from-black/[0.02] dark:from-white/5 to-transparent opacity-0 transition-opacity group-hover/card:opacity-100" />
                    <span v-if="item.featured && !loading" class="tm-featured-badge">
                        <Star class="size-3 fill-current" :stroke-width="0" />
                        <span>Featured</span>
                    </span>
                    <div class="relative z-10 flex flex-1 flex-col gap-4 overflow-hidden">
                        <p class="text-sm leading-relaxed text-muted-foreground line-clamp-5">
                            <span v-if="loading" class="sk-shimmer">{{ item.text.replace(/<[^>]+>/g, ' ') }}</span>
                            <span v-else v-html="item.text" />
                        </p>
                    </div>
                    <div class="relative z-10 flex items-center gap-3 pt-3">
                        <div class="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                            <div v-if="loading" class="tm-avatar-skeleton h-full w-full" />
                            <img
                                v-else
                                :src="item.avatar"
                                :alt="item.name"
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
                </button>
            </div>
            <div
                aria-hidden="true"
                :class="cn('tm-track tm-left flex shrink-0 justify-start [gap:var(--gap)] min-w-full pr-[var(--gap)] will-change-transform [backface-visibility:hidden]')"
                :style="durationStyle"
            >
                <div
                    v-for="(item, i) in rowOne"
                    :key="`r1d-${i}`"
                    :class="cardClass(item, { interactive: false })"
                    tabindex="-1"
                >
                    <span v-if="item.featured && !loading" class="tm-featured-badge">
                        <Star class="size-3 fill-current" :stroke-width="0" />
                        <span>Featured</span>
                    </span>
                    <div class="relative z-10 flex flex-1 flex-col gap-4 overflow-hidden">
                        <p class="text-sm leading-relaxed text-muted-foreground line-clamp-5">
                            <span v-if="loading" class="sk-shimmer">{{ item.text.replace(/<[^>]+>/g, ' ') }}</span>
                            <span v-else v-html="item.text" />
                        </p>
                    </div>
                    <div class="relative z-10 flex items-center gap-3 pt-3">
                        <div class="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                            <div v-if="loading" class="tm-avatar-skeleton h-full w-full" />
                            <img v-else :src="item.avatar" alt="" class="h-full w-full object-cover" loading="lazy" referrerpolicy="no-referrer" />
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
                </div>
            </div>
        </div>

        <div class="tm-row group flex overflow-hidden p-2 [--gap:1rem] [mask-image:linear-gradient(to_right,transparent,#000_48px,#000_calc(100%-48px),transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_48px,#000_calc(100%-48px),transparent)]">
            <div
                :class="cn('tm-track tm-right flex shrink-0 justify-start [gap:var(--gap)] min-w-full pr-[var(--gap)] will-change-transform [backface-visibility:hidden]')"
                :style="durationStyle"
            >
                <button
                    v-for="(item, i) in rowTwo"
                    :key="`r2-${i}`"
                    type="button"
                    :class="cardClass(item, { interactive: true })"
                    :disabled="loading"
                    :aria-busy="loading || undefined"
                    @click="onCardClick(item)"
                >
                    <div v-if="!loading" class="absolute inset-0 bg-gradient-to-br from-black/[0.02] dark:from-white/5 to-transparent opacity-0 transition-opacity group-hover/card:opacity-100" />
                    <span v-if="item.featured && !loading" class="tm-featured-badge">
                        <Star class="size-3 fill-current" :stroke-width="0" />
                        <span>Featured</span>
                    </span>
                    <div class="relative z-10 flex flex-1 flex-col gap-4 overflow-hidden">
                        <p class="text-sm leading-relaxed text-muted-foreground line-clamp-5">
                            <span v-if="loading" class="sk-shimmer">{{ item.text.replace(/<[^>]+>/g, ' ') }}</span>
                            <span v-else v-html="item.text" />
                        </p>
                    </div>
                    <div class="relative z-10 flex items-center gap-3 pt-3">
                        <div class="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                            <div v-if="loading" class="tm-avatar-skeleton h-full w-full" />
                            <img
                                v-else
                                :src="item.avatar"
                                :alt="item.name"
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
                </button>
            </div>
            <div
                aria-hidden="true"
                :class="cn('tm-track tm-right flex shrink-0 justify-start [gap:var(--gap)] min-w-full pr-[var(--gap)] will-change-transform [backface-visibility:hidden]')"
                :style="durationStyle"
            >
                <div
                    v-for="(item, i) in rowTwo"
                    :key="`r2d-${i}`"
                    :class="cardClass(item, { interactive: false })"
                    tabindex="-1"
                >
                    <span v-if="item.featured && !loading" class="tm-featured-badge">
                        <Star class="size-3 fill-current" :stroke-width="0" />
                        <span>Featured</span>
                    </span>
                    <div class="relative z-10 flex flex-1 flex-col gap-4 overflow-hidden">
                        <p class="text-sm leading-relaxed text-muted-foreground line-clamp-5">
                            <span v-if="loading" class="sk-shimmer">{{ item.text.replace(/<[^>]+>/g, ' ') }}</span>
                            <span v-else v-html="item.text" />
                        </p>
                    </div>
                    <div class="relative z-10 flex items-center gap-3 pt-3">
                        <div class="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                            <div v-if="loading" class="tm-avatar-skeleton h-full w-full" />
                            <img v-else :src="item.avatar" alt="" class="h-full w-full object-cover" loading="lazy" referrerpolicy="no-referrer" />
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
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes tm-marquee-left {
    from { transform: translate3d(0, 0, 0); }
    to { transform: translate3d(-100%, 0, 0); }
}
@keyframes tm-marquee-right {
    from { transform: translate3d(-100%, 0, 0); }
    to { transform: translate3d(0, 0, 0); }
}
.tm-track.tm-left {
    animation: tm-marquee-left var(--duration) linear infinite;
}
.tm-track.tm-right {
    animation: tm-marquee-right var(--duration) linear infinite;
}
.tm-row:hover .tm-track,
.tm-row:focus-within .tm-track {
    animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
    .tm-track.tm-left,
    .tm-track.tm-right {
        animation: none;
    }
}

.tm-avatar-skeleton {
    background: hsl(0 0% 100% / 0.08);
    animation: sk-pulse 2s ease-in-out infinite;
}
:root[data-theme="light"] .tm-avatar-skeleton {
    background: hsl(0 0% 0% / 0.08);
}

.tm-card--featured {
    border-color: var(--accent-amber);
}
.tm-card--featured > div.flex-1 {
    padding-top: 1.25rem;
}

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
</style>
