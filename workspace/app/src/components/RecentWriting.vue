<script setup lang="ts">
const posts = [
    {
        title: "How to modernise an AS/400 banking core without replacing it",
        description:
            "A strangler approach built around stable Go contracts, observability, reconciliation, and reversible cutovers.",
        url: "https://writing.gocanto.sh/modernise-as400-banking-core",
        topic: "Banking modernisation",
    },
    {
        title: "Designing idempotent payment flows across retries, webhooks, and ledgers",
        description:
            "A correctness model for duplicate requests, ambiguous provider results, signed events, and reconciliation.",
        url: "https://writing.gocanto.sh/idempotent-payment-flows",
        topic: "Payment systems",
    },
    {
        title: "Building auditable AI agents for regulated systems",
        description:
            "Typed tools, human approval, signed event chains, replay, and validators that fail closed.",
        url: "https://writing.gocanto.sh/auditable-ai-agents-regulated-systems",
        topic: "Production AI",
    },
] as const;
</script>

<template>
    <section id="writing" class="recent-writing outer" aria-labelledby="recent-writing-title">
        <div class="section-heading">
            <div>
                <span>Field notes · First-hand systems</span>
                <h2 id="recent-writing-title">Recent writing</h2>
            </div>
            <a href="https://writing.gocanto.sh/" data-analytics="writing-index">All writing ↗</a>
        </div>
        <div class="recent-writing__grid">
            <a
                v-for="post in posts"
                :key="post.url"
                :href="post.url"
                data-analytics="writing-transition"
            >
                <span>{{ post.topic }}</span>
                <h3>{{ post.title }}</h3>
                <p>{{ post.description }}</p>
            </a>
        </div>
    </section>
</template>
