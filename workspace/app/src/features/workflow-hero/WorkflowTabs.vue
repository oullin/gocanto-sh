<script setup lang="ts">
import type { Workflow } from "#app/features/workflow-hero";

defineProps<{
    activeTab: string;
    workflows: readonly Workflow[];
}>();

const emit = defineEmits<{
    keydown: [event: KeyboardEvent, index: number];
    select: [id: string];
    setTabRef: [el: HTMLButtonElement | null, index: number];
}>();
</script>

<template>
    <div class="wf-tabs-wrap">
        <div class="wf-tabs-frame">
            <div class="wf-tabs" role="tablist" aria-label="AI agent workflows">
                <button
                    v-for="(workflow, index) in workflows"
                    :id="'wf-tab-' + workflow.id"
                    :key="workflow.id"
                    :ref="(el) => emit('setTabRef', el as HTMLButtonElement | null, index)"
                    type="button"
                    class="wf-tab"
                    :class="{ 'is-active': activeTab === workflow.id }"
                    role="tab"
                    :aria-selected="activeTab === workflow.id"
                    :aria-controls="'wf-panel-' + workflow.id"
                    :tabindex="activeTab === workflow.id ? 0 : -1"
                    @click="emit('select', workflow.id)"
                    @keydown="emit('keydown', $event, index)"
                >
                    <component :is="workflow.icon" class="size-4" aria-hidden="true" />
                    <span>{{ workflow.label }}</span>
                </button>
            </div>
        </div>
    </div>
</template>
