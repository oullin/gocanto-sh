<script setup lang="ts">
import "@features/workflow-hero/workflow-hero.css";

import { workflows } from "@features/workflow-hero/data";
import { useWorkflowTabs } from "@features/workflow-hero/useWorkflowTabs";
import WorkflowCanvas from "@features/workflow-hero/WorkflowCanvas.vue";
import WorkflowHeroIntro from "@features/workflow-hero/WorkflowHeroIntro.vue";
import WorkflowTabs from "@features/workflow-hero/WorkflowTabs.vue";

const { activeTab, activeWorkflow, onTabKeydown, panelKey, selectTab, setTabRef } =
    useWorkflowTabs(workflows);
</script>

<template>
    <section id="about" class="wf-hero" aria-labelledby="hero-title">
        <WorkflowHeroIntro />
        <WorkflowTabs
            :active-tab="activeTab"
            :workflows="workflows"
            @keydown="onTabKeydown"
            @select="selectTab"
            @set-tab-ref="setTabRef"
        />
        <WorkflowCanvas :panel-key="panelKey" :workflow="activeWorkflow" />
    </section>
</template>
