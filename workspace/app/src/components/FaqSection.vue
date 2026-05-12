<script setup lang="ts">
import { Plus } from "lucide-vue-next";
import { ref } from "vue";

import SectionCorners from "@components/SectionCorners.vue";
import { faqs } from "@data";

const openIndex = ref<number | null>(0);

function toggle(index: number) {
    openIndex.value = openIndex.value === index ? null : index;
}
</script>

<template>
    <section id="faq" class="relative border-b border-border">
        <SectionCorners />
        <div class="mx-auto max-w-page px-6 py-[120px]">
            <div class="mx-auto mb-16 max-w-[720px] text-center">
                <span class="font-mono text-xs tracking-[0.02em] text-fg-3">FAQ</span>
                <h2
                    class="mt-3.5 text-[clamp(32px,4vw,48px)] font-semibold leading-[1.08] tracking-[-0.04em]"
                >
                    Questions worth answering up front.
                </h2>
            </div>
            <div class="mx-auto flex max-w-[760px] flex-col border-t border-border">
                <div
                    v-for="(item, index) in faqs"
                    :key="item.question"
                    class="border-b border-border"
                >
                    <button
                        type="button"
                        class="flex w-full cursor-pointer items-center justify-between gap-5 border-none bg-transparent py-[22px] text-left font-sans text-base font-medium tracking-[-0.015em] text-foreground"
                        :aria-expanded="openIndex === index"
                        @click="toggle(index)"
                    >
                        {{ item.question }}
                        <Plus
                            :size="14"
                            :stroke-width="1.6"
                            aria-hidden="true"
                            class="transition-[transform,color] duration-200"
                            :class="openIndex === index ? 'rotate-45 text-accent' : 'text-fg-3'"
                        />
                    </button>
                    <div
                        class="overflow-hidden text-[15px] leading-[1.65] text-fg-2 transition-[max-height,padding] duration-300 ease-in-out"
                        :class="openIndex === index ? 'max-h-[400px] pb-[22px]' : 'max-h-0'"
                    >
                        {{ item.answer }}
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
