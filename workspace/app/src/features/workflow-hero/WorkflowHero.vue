<script setup lang="ts">
import "#app/features/workflow-hero/workflow-hero.css";

import { workflows } from "#app/features/workflow-hero";
import { useWorkflowTabs } from "#app/features/workflow-hero";
import WorkflowCanvas from "#app/features/workflow-hero/WorkflowCanvas.vue";
import WorkflowHeroIntro from "#app/features/workflow-hero/WorkflowHeroIntro.vue";
import WorkflowTabs from "#app/features/workflow-hero/WorkflowTabs.vue";

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
