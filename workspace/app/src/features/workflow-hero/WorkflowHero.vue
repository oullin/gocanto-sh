<script setup lang="ts">
import "@features/workflow-hero/workflow-hero.css";

import {
    defaultWorkflow,
    workflowMetadata,
    workflowPayloadLoaders,
} from "@features/workflow-hero/data";
import { useWorkflowTabs } from "@features/workflow-hero/useWorkflowTabs";
import { WorkflowLoader } from "@features/workflow-hero/WorkflowLoader";
import WorkflowCanvas from "@features/workflow-hero/WorkflowCanvas.vue";
import WorkflowHeroIntro from "@features/workflow-hero/WorkflowHeroIntro.vue";
import WorkflowTabs from "@features/workflow-hero/WorkflowTabs.vue";

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
