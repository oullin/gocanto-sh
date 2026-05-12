<script setup lang="ts">
import SectionCorners from "@components/SectionCorners.vue";
import { industries } from "@data";
</script>

<template>
    <section class="relative border-b border-border px-6 py-14">
        <SectionCorners top />
        <div class="mx-auto max-w-page text-center">
            <div class="font-mono text-xs tracking-[0.02em] text-fg-3">
                Shipped production systems across
            </div>
            <div class="mt-7 flex flex-wrap justify-center gap-x-14 gap-y-9 text-fg-2">
                <span
                    v-for="item in industries"
                    :key="item"
                    class="text-[17px] font-medium tracking-[-0.015em] opacity-70 transition-opacity duration-150 hover:opacity-100"
                    >{{ item }}</span
                >
            </div>
        </div>
    </section>
</template>
