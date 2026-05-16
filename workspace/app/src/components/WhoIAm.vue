<script setup lang="ts">
import { ref } from "vue";
import { bio } from "@gocanto/store";
import { useInViewReady } from "@lib/useAsyncInView";

const section = ref<HTMLElement | null>(null);
const ready = useInViewReady(section);

const data = bio.data;
</script>

<template>
    <section ref="section">
        <div class="bio">
            <aside class="bio-side">
                <span class="kicker">Who I am</span>
                <h2><span :class="{ 'sk-shimmer': !ready }">{{ data.tagline }}</span></h2>
                <p class="lede">
                    <span :class="{ 'sk-shimmer': !ready }">
                        The short version, in plain English. No buzzwords.
                    </span>
                </p>
                <div class="note">
                    <span :class="{ 'sk-shimmer': !ready }">{{ data.note }}</span>
                </div>
            </aside>

            <div class="bio-body">
                <p v-for="(p, i) in data.paragraphs" :key="i">
                    <span :class="{ 'sk-shimmer': !ready }" v-html="p" />
                </p>

                <div class="quick-facts">
                    <div v-for="f in data.quick_facts" :key="f.key" class="fact">
                        <div class="k"><span :class="{ 'sk-shimmer': !ready }">{{ f.key }}</span></div>
                        <div class="v"><span :class="{ 'sk-shimmer': !ready }">{{ f.value }}</span></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
