<script setup lang="ts">
import SectionCorners from "@components/SectionCorners.vue";
import { ctaCopy } from "@data";
</script>

<template>
    <section id="cta" class="relative border-b border-border">
        <SectionCorners />
        <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div
                class="cta-glow pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2"
            ></div>
        </div>
        <div class="relative mx-auto max-w-page px-6 py-[140px] text-center">
            <h2
                class="relative text-[clamp(40px,5.5vw,72px)] font-semibold leading-[1.04] tracking-[-0.045em]"
            >
                {{ ctaCopy.title }}
            </h2>
            <p
                class="relative mx-auto mt-[22px] max-w-[560px] text-[17px] leading-[1.55] text-fg-2"
            >
                {{ ctaCopy.subtitle }}
            </p>
            <div class="relative mt-9 flex justify-center gap-2">
                <a
                    class="inline-flex cursor-pointer items-center gap-2 rounded-[7px] border border-transparent bg-foreground px-[18px] py-2.5 font-sans text-sm font-medium text-black transition-all duration-150 hover:bg-white"
                    :href="ctaCopy.primary.href"
                    target="_blank"
                    rel="noreferrer"
                    >{{ ctaCopy.primary.label }}</a
                >
                <a
                    class="inline-flex cursor-pointer items-center gap-2 rounded-[7px] border border-border-strong bg-transparent px-[18px] py-2.5 font-sans text-sm font-medium text-foreground transition-all duration-150 hover:border-border-strong hover:bg-bg-2"
                    :href="ctaCopy.secondary.href"
                    target="_blank"
                    rel="noreferrer"
                    >{{ ctaCopy.secondary.label }}</a
                >
            </div>
        </div>
    </section>
</template>
