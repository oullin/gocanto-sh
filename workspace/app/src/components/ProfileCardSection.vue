<script setup lang="ts">
import AboutSection from "@components/AboutSection.vue";
import { profile, profileCardCopy } from "@data";
</script>

<template>
    <section class="relative border-b border-border px-6 py-14">
        <div class="mx-auto max-w-page">
            <div
                class="relative grid min-h-55 grid-cols-[220px_1fr] items-stretch gap-7 p-7 max-[720px]:grid-cols-1 max-[720px]:gap-4.5 max-[720px]:p-5.5"
            >
                <div
                    class="size-47 self-center justify-self-center overflow-hidden rounded-full border border-border-strong bg-bg-2 max-[720px]:size-35"
                >
                    <img
                        :src="profile.avatarUrl"
                        :alt="profile.name"
                        class="block size-full object-cover filter-[grayscale(0.05)]"
                    />
                </div>

                <div
                    class="relative flex flex-col justify-end border-l border-border px-2 pb-2 pt-3 max-[720px]:items-start max-[720px]:border-l-0 max-[720px]:border-t max-[720px]:px-1 max-[720px]:pb-7 max-[720px]:pt-4.5"
                >
                    <span
                        class="absolute right-2 top-1 text-[18px] leading-none max-[720px]:right-1 max-[720px]:top-3.5"
                        role="img"
                        :aria-label="profileCardCopy.flag.label"
                        :title="profileCardCopy.flag.label"
                        >{{ profileCardCopy.flag.emoji }}</span
                    >

                    <div class="flex items-center gap-2.5">
                        <h2
                            class="font-mono text-[clamp(28px,4vw,40px)] font-semibold leading-[1.05] tracking-[-0.01em] text-foreground"
                        >
                            {{ profile.name }}
                        </h2>
                    </div>
                    <div
                        class="mt-3 inline-block self-start border border-border bg-bg-2 px-2.5 py-1.5 font-mono text-sm text-fg-2"
                    >
                        {{ profileCardCopy.role }}
                    </div>

                    <a
                        class="absolute bottom-1 right-2 inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.04em] text-fg-3 transition-colors duration-150 hover:text-foreground max-[720px]:bottom-1.5 max-[720px]:right-1"
                        :href="profileCardCopy.knowMore.href"
                        :target="profileCardCopy.knowMore.external ? '_blank' : undefined"
                        :rel="profileCardCopy.knowMore.external ? 'noreferrer' : undefined"
                    >
                        {{ profileCardCopy.knowMore.label }}
                        <span aria-hidden="true">→</span>
                    </a>
                </div>
            </div>
        </div>
        <AboutSection class="mt-10" />
    </section>
</template>
