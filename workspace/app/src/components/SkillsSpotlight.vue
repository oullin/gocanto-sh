<script setup lang="ts">
import { ref } from "vue";
import { useInViewReady } from "#app/lib/useAsyncInView";

type Pillar = {
    sub: string;
    title: string;
    body: string;
};

const section = ref<HTMLElement | null>(null);

const pillars: Pillar[] = [
    {
        sub: "Agentic AI",
        title: "AI assistants you can actually trust with real work.",
        body: 'AI that books, files, refunds, and dispatches. Every action is logged, every decision is replayable, and the system refuses unsafe steps before they happen. Built for teams who can\'t afford an AI "oops."',
    },
    {
        sub: "Banking & Fintech",
        title: "Modernise the surface. Leave the old core where it is.",
        body: "Most banks run on 30-year-old systems that still work. They just feel slow and rigid. I wrap them in a fast, modern layer that adds logins, retries, rate limits, and full audit trails. Customers get a 2026 app; the regulator gets a clean paper trail.",
    },
    {
        sub: "E-Commerce",
        title: "Checkouts that don't drop sales when traffic spikes.",
        body: "Multi-country checkout, modular payment adapters, dozens of integrations. Built so a Black-Friday spike doesn't drop orders and the finance team's end-of-day numbers still balance to the cent.",
    },
];

const ready = useInViewReady(section);
</script>

<template>
    <section ref="section">
        <div class="sect-head">
            <div>
                <span class="kicker">What I can do for you</span>
                <h2>Three kinds of problems I solve.</h2>
            </div>
            <div class="sub">
                If your team is staring at one of these, we should talk. Plain language first; deep
                technical detail is further down the page.
            </div>
        </div>

        <div class="pillars">
            <article class="pillar" :aria-busy="!ready">
                <div class="art">
                    <svg width="60" height="60" viewBox="0 0 60 60" aria-hidden="true">
                        <circle class="ico-line" cx="30" cy="22" r="9" />
                        <path class="ico-line" d="M30 31 L30 44 M22 38 L38 38" />
                        <circle class="ico-line" cx="16" cy="48" r="3" />
                        <circle class="ico-line" cx="30" cy="48" r="3" />
                        <circle class="ico-line" cx="44" cy="48" r="3" />
                    </svg>
                </div>
                <div class="sub">
                    <span :class="{ 'sk-shimmer': !ready }">{{ pillars[0].sub }}</span>
                </div>
                <h3>
                    <span :class="{ 'sk-shimmer': !ready }">{{ pillars[0].title }}</span>
                </h3>
                <p>
                    <span :class="{ 'sk-shimmer': !ready }">{{ pillars[0].body }}</span>
                </p>
            </article>

            <article class="pillar" :aria-busy="!ready">
                <div class="art">
                    <svg width="80" height="60" viewBox="0 0 80 60" aria-hidden="true">
                        <rect class="ico-line" x="14" y="20" width="52" height="32" rx="3" />
                        <path class="ico-line" d="M14 30 L66 30" />
                        <path class="ico-line" d="M22 40 L34 40 M22 45 L30 45" />
                        <circle class="ico-line" cx="56" cy="42" r="4" />
                        <path class="ico-line" d="M22 14 L58 14 L60 20 L20 20 Z" />
                    </svg>
                </div>
                <div class="sub">
                    <span :class="{ 'sk-shimmer': !ready }">{{ pillars[1].sub }}</span>
                </div>
                <h3>
                    <span :class="{ 'sk-shimmer': !ready }">{{ pillars[1].title }}</span>
                </h3>
                <p>
                    <span :class="{ 'sk-shimmer': !ready }">{{ pillars[1].body }}</span>
                </p>
            </article>

            <article class="pillar" :aria-busy="!ready">
                <div class="art">
                    <svg width="80" height="60" viewBox="0 0 80 60" aria-hidden="true">
                        <path class="ico-line" d="M18 22 L62 22 L58 46 L22 46 Z" />
                        <path class="ico-line" d="M18 22 L14 14 L8 14" />
                        <circle class="ico-line" cx="28" cy="52" r="3" />
                        <circle class="ico-line" cx="52" cy="52" r="3" />
                        <path class="ico-line" d="M30 30 L50 30 M30 36 L46 36" />
                    </svg>
                </div>
                <div class="sub">
                    <span :class="{ 'sk-shimmer': !ready }">{{ pillars[2].sub }}</span>
                </div>
                <h3>
                    <span :class="{ 'sk-shimmer': !ready }">{{ pillars[2].title }}</span>
                </h3>
                <p>
                    <span :class="{ 'sk-shimmer': !ready }">{{ pillars[2].body }}</span>
                </p>
            </article>
        </div>
    </section>
</template>
