<script setup lang="ts">
import { ref } from "vue";
import { bio } from "@gocanto/store";
import { useInViewReady } from "@lib/useAsyncInView";

const section = ref<HTMLElement | null>(null);
const ready = useInViewReady(section);

const data = bio.data;
const stackedFactKeys = new Set(["Originally from"]);

const shouldStackFact = (fact: (typeof data.quick_facts)[number]) => stackedFactKeys.has(fact.key);
const factValueLines = (fact: (typeof data.quick_facts)[number]) => fact.value.split(" · ");

type ParagraphToken = { type: "text" | "em"; value: string };

const EM_TAG_RE = /<em>([\s\S]*?)<\/em>/gi;

const tokenizeParagraph = (input: string): ParagraphToken[] => {
    const out: ParagraphToken[] = [];
    let cursor = 0;

    for (const match of input.matchAll(EM_TAG_RE)) {
        const start = match.index ?? 0;

        if (start > cursor) {
            out.push({ type: "text", value: input.slice(cursor, start) });
        }

        out.push({ type: "em", value: match[1] });
        cursor = start + match[0].length;
    }

    if (cursor < input.length) {
        out.push({ type: "text", value: input.slice(cursor) });
    }

    return out;
};

const paragraphs = data.paragraphs.map(tokenizeParagraph);
</script>

<template>
    <section id="bio" ref="section">
        <div class="bio">
            <aside class="bio-side">
                <span class="kicker">Who I am</span>
                <h2>
                    <span :class="{ 'sk-shimmer': !ready }">{{ data.tagline }}</span>
                </h2>
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
                <p v-for="(tokens, i) in paragraphs" :key="i">
                    <span :class="{ 'sk-shimmer': !ready }">
                        <template v-for="(t, j) in tokens" :key="j">
                            <em v-if="t.type === 'em'">{{ t.value }}</em>
                            <template v-else>{{ t.value }}</template>
                        </template>
                    </span>
                </p>

                <div class="quick-facts">
                    <div v-for="f in data.quick_facts" :key="f.key" class="fact">
                        <div class="k">
                            <span :class="{ 'sk-shimmer': !ready }">{{ f.key }}</span>
                        </div>
                        <div class="v" :class="{ 'v--stacked': shouldStackFact(f) }">
                            <template v-if="shouldStackFact(f)">
                                <span
                                    v-for="line in factValueLines(f)"
                                    :key="line"
                                    :class="{ 'sk-shimmer': !ready }"
                                >
                                    {{ line }}
                                </span>
                            </template>
                            <span v-else :class="{ 'sk-shimmer': !ready }">{{ f.value }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
