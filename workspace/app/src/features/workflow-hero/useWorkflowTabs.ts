import { computed, nextTick, ref } from "vue";

import type { Workflow } from "#app/features/workflow-hero";

/** Coordinates active workflow tabs, focus movement, and panel refreshes. */
export const useWorkflowTabs = (workflows: readonly Workflow[]) => {
    const fallbackWorkflow = workflows[0];

    if (!fallbackWorkflow) {
        throw new Error("WorkflowHero requires at least one workflow");
    }

    const activeTab = ref(fallbackWorkflow.id);
    const panelKey = ref(0);
    const tabRefs = ref<HTMLButtonElement[]>([]);

    const activeWorkflow = computed(
        () => workflows.find((workflow) => workflow.id === activeTab.value) ?? fallbackWorkflow,
    );

    const setTabRef = (el: HTMLButtonElement | null, index: number) => {
        if (el) {
            tabRefs.value[index] = el;
        }
    };

    const selectTab = async (id: string, focusIndex?: number) => {
        if (activeTab.value !== id) {
            activeTab.value = id;
            panelKey.value += 1;
        }

        if (typeof focusIndex === "number") {
            await nextTick();
            tabRefs.value[focusIndex]?.focus();
        }
    };

    const onTabKeydown = (event: KeyboardEvent, index: number) => {
        const lastIndex = workflows.length - 1;
        let nextIndex: number | null = null;

        if (event.key === "ArrowRight") {
            nextIndex = index === lastIndex ? 0 : index + 1;
        } else if (event.key === "ArrowLeft") {
            nextIndex = index === 0 ? lastIndex : index - 1;
        } else if (event.key === "Home") {
            nextIndex = 0;
        } else if (event.key === "End") {
            nextIndex = lastIndex;
        }

        if (nextIndex !== null) {
            event.preventDefault();
            void selectTab(workflows[nextIndex].id, nextIndex);
        }
    };

    return {
        activeTab,
        activeWorkflow,
        onTabKeydown,
        panelKey,
        selectTab,
        setTabRef,
    };
};
