<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next";

import ChannelIcon from "@components/ChannelIcon.vue";
import SectionCorners from "@components/SectionCorners.vue";
import { connectChannels, connectHeading } from "@data";
</script>

<template>
    <section id="connect" class="relative border-b border-border">
        <SectionCorners />
        <div class="mx-auto max-w-page px-6 py-[120px]">
            <div class="mx-auto mb-16 max-w-[720px] text-center">
                <span class="font-mono text-xs tracking-[0.02em] text-fg-3">{{
                    connectHeading.eyebrow
                }}</span>
                <h2
                    class="mt-3.5 text-[clamp(32px,4vw,48px)] font-semibold leading-[1.08] tracking-[-0.04em]"
                >
                    {{ connectHeading.title }}
                    <span class="text-accent">{{ connectHeading.highlight }}</span
                    >{{ connectHeading.trailing }}
                </h2>
                <p class="mx-auto mt-[18px] max-w-[580px] text-[16.5px] leading-[1.55] text-fg-2">
                    {{ connectHeading.subtitle }}
                </p>
            </div>

            <div
                class="mt-14 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border max-[900px]:grid-cols-1"
            >
                <a
                    v-for="channel in connectChannels"
                    :key="channel.name"
                    class="group flex flex-col gap-3.5 bg-background px-[22px] py-6 transition-colors duration-150 hover:bg-bg-2"
                    :href="channel.href"
                    :target="channel.icon === 'mail' ? undefined : '_blank'"
                    :rel="channel.icon === 'mail' ? undefined : 'noreferrer'"
                >
                    <div class="flex items-center justify-between">
                        <div class="grid size-[30px] place-items-center text-foreground">
                            <ChannelIcon :name="channel.icon" />
                        </div>
                        <span
                            class="text-fg-3 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
                        >
                            <ArrowUpRight :size="14" :stroke-width="1.5" aria-hidden="true" />
                        </span>
                    </div>
                    <div>
                        <div class="text-[15px] font-semibold tracking-[-0.015em]">
                            {{ channel.name }}
                        </div>
                        <div class="mt-0.5 font-mono text-xs text-fg-3">{{ channel.handle }}</div>
                    </div>
                    <div class="text-[13.5px] leading-[1.5] text-fg-2">
                        {{ channel.description }}
                    </div>
                </a>
            </div>
        </div>
    </section>
</template>
