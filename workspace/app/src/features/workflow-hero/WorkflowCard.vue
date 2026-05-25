<script setup lang="ts">
import { Bot, FileText, Menu } from "lucide-vue-next";

import type { WorkflowStep } from "./types";

defineProps<{
    step: WorkflowStep;
}>();

const detailFirstStepIds = new Set([
    "meeting-left",
    "meeting-right",
    "follow-action",
    "data-action",
    "report-action",
    "content-action",
]);
</script>

<template>
    <article
        class="wf-card"
        :data-step-id="step.id"
        :class="['wf-card--' + step.position, 'wf-card--' + step.delay]"
    >
        <div class="wf-card__tag">
            <component :is="step.labelIcon" class="size-4" aria-hidden="true" />
            <span>{{ step.label }}</span>
        </div>

        <div class="wf-card__body">
            <header class="wf-card__header">
                <component :is="step.icon" class="size-5" aria-hidden="true" />
                <h2>{{ step.title }}</h2>
                <span v-if="step.titleMeta" class="wf-card__meta">{{ step.titleMeta }}</span>
                <span class="wf-card__menu" aria-hidden="true">
                    <Menu class="size-4" />
                </span>
            </header>

            <p
                v-if="step.description && !detailFirstStepIds.has(step.id)"
                class="wf-card__description"
            >
                {{ step.description }}
            </p>

            <div v-if="step.details?.length || step.chip" class="wf-card__details">
                <span v-if="step.chip" class="wf-card__chip">{{ step.chip }}</span>
                <div v-for="detail in step.details" :key="detail.text" class="wf-card__detail">
                    <img
                        v-if="detail.asset"
                        :src="detail.asset"
                        :alt="detail.alt ?? ''"
                        width="18"
                        height="18"
                        loading="lazy"
                        decoding="async"
                        referrerpolicy="no-referrer"
                    />
                    <span v-else class="wf-card__bullet" aria-hidden="true"></span>
                    <span>{{ detail.text }}</span>
                </div>
            </div>

            <p
                v-if="step.description && detailFirstStepIds.has(step.id)"
                class="wf-card__description"
            >
                {{ step.description }}
            </p>

            <footer v-if="step.time || step.model || step.action" class="wf-card__footer">
                <span v-if="step.time" class="wf-card__time">{{ step.time }}</span>
                <span v-if="step.model" class="wf-card__model">
                    <Bot class="size-[18px]" aria-hidden="true" />
                    {{ step.modelLabel ?? "Claude + GPT-4" }}
                </span>
                <span v-if="step.action" class="wf-card__action">
                    <FileText
                        v-if="step.action === 'File updated'"
                        class="size-[18px]"
                        aria-hidden="true"
                    />
                    {{ step.action }}
                </span>
            </footer>
        </div>
    </article>
</template>
