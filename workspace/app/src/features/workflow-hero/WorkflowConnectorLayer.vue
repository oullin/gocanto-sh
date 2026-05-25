<script setup lang="ts">
import type { WorkflowConnector } from "@features/workflow-hero/types";

defineProps<{
    connectors: readonly WorkflowConnector[];
}>();
</script>

<template>
    <svg class="wf-connectors" viewBox="0 0 1280 604" fill="none" aria-hidden="true">
        <svg
            v-for="connector in connectors"
            :key="connector.x + '-' + connector.y + '-' + connector.viewBox"
            class="wf-connector"
            :class="'wf-connector--' + connector.delay"
            :x="connector.x"
            :y="connector.y"
            :width="connector.width"
            :height="connector.height"
            :viewBox="connector.viewBox"
            fill="none"
        >
            <path class="wf-connector-diamond" :d="connector.diamond" />
            <path class="wf-connector-path" :d="connector.line" pathLength="1" />
            <path class="wf-connector-arrow" :d="connector.arrow" pathLength="1" />
        </svg>
    </svg>
</template>
