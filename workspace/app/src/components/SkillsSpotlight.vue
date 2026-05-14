<script setup lang="ts">
import { ref } from "vue";
import { profile } from "@gocanto/data";
import {
    Bot,
    Check,
    CreditCard,
    Image as ImageIcon,
    Landmark,
    Loader,
    Plus,
    ShoppingBag,
    Star,
    Wrench,
} from "lucide-vue-next";
import { useInViewReady } from "@lib/useAsyncInView";

type Topic = { title: string; description: string; illo: "ai" | "fintech" | "ecom" };

const section = ref<HTMLElement | null>(null);

const findSkill = (name: string) =>
    profile.data.skills.find((s) => s.item === name);

const topics: Topic[] = [
    {
        title: "Agentic AI",
        description: findSkill("Agentic Orchestration")?.description ?? "",
        illo: "ai",
    },
    {
        title: "Banking & Fintech",
        description:
            findSkill("AS/400 Modernisation")?.description
            ?? findSkill("Payment Integration")?.description
            ?? "",
        illo: "fintech",
    },
    {
        title: "E-Commerce",
        description:
            findSkill("E-commerce Architecture")?.description
            ?? findSkill("Complex 3rd Party System Integrations")?.description
            ?? "",
        illo: "ecom",
    },
];

const ready = useInViewReady(section);
</script>

<template>
    <section ref="section" class="topics frame-section">
        <a
            v-for="(t, i) in topics"
            :key="`${t.illo}-${i}`"
            :href="ready ? '#' : undefined"
            class="topic-card"
            :aria-busy="!ready"
        >
            <div class="topic-illo" :class="t.illo">
                <template v-if="ready">
                    <template v-if="t.illo === 'ai'">
                        <div class="ai-avatar">
                            <Bot :size="14" :stroke-width="1.5" />
                            <span class="ai-status-dot" />
                        </div>
                        <div class="ai-rail" />
                        <div class="ai-task ai-task-done">
                            <span class="ai-task-status ai-task-status-done">
                                <Check :size="10" :stroke-width="2" />
                            </span>
                            <span class="ai-task-bar ai-task-bar-1" />
                        </div>
                        <div class="ai-task ai-task-progress">
                            <span class="ai-task-status ai-task-status-progress">
                                <Loader :size="10" :stroke-width="2" />
                            </span>
                            <span class="ai-task-bar ai-task-bar-2" />
                        </div>
                        <div class="ai-task ai-task-queued">
                            <span class="ai-task-status" />
                            <span class="ai-task-bar ai-task-bar-3" />
                        </div>
                        <div class="ai-tool">
                            <Wrench :size="10" :stroke-width="1.75" />
                            <span class="ai-tool-bar" />
                        </div>
                    </template>
                    <template v-else-if="t.illo === 'fintech'">
                        <div class="fintech-chip">
                            <Landmark :size="12" :stroke-width="1.5" />
                        </div>
                        <div class="fintech-txn fintech-txn-1">
                            <span class="fintech-txn-dot" />
                            <span class="fintech-txn-bar" />
                            <span class="fintech-txn-amt">$</span>
                        </div>
                        <div class="fintech-txn fintech-txn-2">
                            <span class="fintech-txn-dot" />
                            <span class="fintech-txn-bar" />
                            <span class="fintech-txn-amt">$</span>
                        </div>
                        <div class="fintech-card">
                            <span class="fintech-card-chip" />
                            <span class="fintech-card-digits fintech-card-digits-1" />
                            <span class="fintech-card-digits fintech-card-digits-2" />
                            <span class="fintech-card-name" />
                            <span class="fintech-card-brand">
                                <CreditCard :size="14" :stroke-width="1.5" />
                            </span>
                        </div>
                    </template>
                    <template v-else-if="t.illo === 'ecom'">
                        <div class="ecom-card">
                            <div class="ecom-image">
                                <ImageIcon :size="18" :stroke-width="1.25" />
                            </div>
                            <div class="ecom-detail">
                                <span class="ecom-title-bar" />
                                <span class="ecom-sub-bar" />
                                <div class="ecom-row">
                                    <span class="ecom-price">$</span>
                                    <span class="ecom-cart">
                                        <Plus :size="10" :stroke-width="2" />
                                    </span>
                                </div>
                            </div>
                            <span class="ecom-badge">
                                <Star :size="10" :stroke-width="1.75" />
                            </span>
                        </div>
                        <div class="ecom-corner">
                            <ShoppingBag :size="12" :stroke-width="1.5" />
                        </div>
                    </template>
                </template>
                <div v-else class="topic-illo-skeleton" aria-hidden="true" />
            </div>
            <div class="topic-body">
                <h3>
                    <span :class="{ 'sk-shimmer': !ready }">{{ t.title }}</span>
                </h3>
                <p>
                    <span :class="{ 'sk-shimmer': !ready }">{{ t.description }}</span>
                </p>
            </div>
        </a>
    </section>
</template>
