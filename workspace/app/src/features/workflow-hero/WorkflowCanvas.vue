<script setup lang="ts">
import type { Workflow, WorkflowMetadata, WorkflowPanelState } from "@features/workflow-hero/types";
import WorkflowCard from "@features/workflow-hero/WorkflowCard.vue";
import WorkflowConnectorLayer from "@features/workflow-hero/WorkflowConnectorLayer.vue";

defineProps<{
    metadata: WorkflowMetadata;
    panelKey: number;
    panelState: WorkflowPanelState;
    workflow: Workflow | null;
}>();

defineEmits<{
    retry: [];
}>();
</script>

<template>
    <div
        :id="'wf-panel-' + metadata.id"
        :key="metadata.id + '-' + panelKey"
        class="wf-canvas-wrap"
        role="tabpanel"
        :aria-labelledby="'wf-tab-' + metadata.id"
        :aria-busy="panelState === 'loading' || undefined"
        tabindex="0"
    >
        <div class="wf-canvas-frame">
            <div class="wf-canvas">
                <template v-if="workflow">
                    <WorkflowConnectorLayer :connectors="workflow.connectors" />
                    <WorkflowCard v-for="step in workflow.steps" :key="step.id" :step="step" />
                </template>
                <div
                    v-else-if="panelState === 'loading'"
                    class="wf-canvas-status wf-canvas-skeleton"
                    role="status"
                    aria-label="Loading workflow"
                >
                    <span v-for="index in 3" :key="index" class="wf-canvas-skeleton__card" />
                </div>
                <div v-else class="wf-canvas-status" role="alert">
                    <p>This workflow could not be loaded.</p>
                    <button type="button" class="underline" @click="$emit('retry')">Retry</button>
                </div>
            </div>
        </div>
    </div>
</template>
