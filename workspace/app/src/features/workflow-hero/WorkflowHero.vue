<script setup lang="ts">
import "#app/features/workflow-hero/workflow-hero.css";
import { useWorkflowTabs } from "#app/features/workflow-hero/useWorkflowTabs";
import { WorkflowLoader } from "#app/features/workflow-hero/WorkflowLoader";
import WorkflowCanvas from "#app/features/workflow-hero/WorkflowCanvas.vue";
import WorkflowHeroIntro from "#app/features/workflow-hero/WorkflowHeroIntro.vue";
import WorkflowTabs from "#app/features/workflow-hero/WorkflowTabs.vue";

import {
    defaultWorkflow,
    workflowMetadata,
    workflowPayloadLoaders,
} from "#app/features/workflow-hero/data";

const props = defineProps<{
    workflowLoader?: WorkflowLoader;
}>();

const workflowLoader =
    props.workflowLoader ??
    new WorkflowLoader(workflowMetadata, defaultWorkflow, workflowPayloadLoaders);

const {
    activeMetadata,
    activeTab,
    activeWorkflow,
    onTabKeydown,
    panelKey,
    panelState,
    retryActiveWorkflow,
    selectTab,
    setTabRef,
} = useWorkflowTabs(workflowMetadata, workflowLoader);
</script>

<template>
    <section id="about" class="wf-hero" aria-labelledby="hero-title">
        <WorkflowHeroIntro />
        <WorkflowTabs
            :active-tab="activeTab"
            :workflows="workflowMetadata"
            @keydown="onTabKeydown"
            @select="selectTab"
            @set-tab-ref="setTabRef"
        />
        <WorkflowCanvas
            :metadata="activeMetadata"
            :panel-key="panelKey"
            :panel-state="panelState"
            :workflow="activeWorkflow"
            @retry="retryActiveWorkflow"
        />
    </section>
</template>
