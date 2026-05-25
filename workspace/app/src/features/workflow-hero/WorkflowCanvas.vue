<script setup lang="ts">
import type { Workflow } from "./types";
import WorkflowCard from "./WorkflowCard.vue";
import WorkflowConnectorLayer from "./WorkflowConnectorLayer.vue";

defineProps<{
    panelKey: number;
    workflow: Workflow;
}>();
</script>

<template>
    <div
        :id="'wf-panel-' + workflow.id"
        :key="workflow.id + '-' + panelKey"
        class="wf-canvas-wrap"
        role="tabpanel"
        :aria-labelledby="'wf-tab-' + workflow.id"
        tabindex="0"
    >
        <div class="wf-canvas-frame">
            <div class="wf-canvas">
                <WorkflowConnectorLayer :connectors="workflow.connectors" />
                <WorkflowCard v-for="step in workflow.steps" :key="step.id" :step="step" />
            </div>
        </div>
    </div>
</template>
