<script setup lang="ts">
import "./workflow-hero.css";

import { workflows } from "./data";
import { useWorkflowTabs } from "./useWorkflowTabs";
import WorkflowCanvas from "./WorkflowCanvas.vue";
import WorkflowHeroIntro from "./WorkflowHeroIntro.vue";
import WorkflowTabs from "./WorkflowTabs.vue";

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
