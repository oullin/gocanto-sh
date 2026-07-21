import { computed, nextTick, ref, shallowRef } from "vue";

import type { WorkflowLoader } from "@features/workflow-hero/WorkflowLoader";
import type {
    Workflow,
    WorkflowId,
    WorkflowMetadata,
    WorkflowPanelState,
} from "@features/workflow-hero/types";

/** Vue bindings for workflow tab selection, focus, and deferred panel state. */
export const useWorkflowTabs = (
    workflows: readonly WorkflowMetadata[],
    workflowLoader: WorkflowLoader,
) => {
    const fallbackWorkflow = workflows[0];

    if (!fallbackWorkflow) {
        throw new Error("WorkflowHero requires at least one workflow");
    }

    const initialWorkflow = workflowLoader.get(fallbackWorkflow.id);

    if (!initialWorkflow) {
        throw new Error("WorkflowHero requires its default workflow synchronously");
    }

    const activeTab = ref<WorkflowId>(fallbackWorkflow.id);
    const activeWorkflow = shallowRef<Workflow | null>(initialWorkflow);
    const panelKey = ref(0);
    const panelState = ref<WorkflowPanelState>("ready");
    const tabRefs = ref<HTMLButtonElement[]>([]);

    const activeMetadata = computed(
        () => workflows.find((workflow) => workflow.id === activeTab.value) ?? fallbackWorkflow,
    );

    const setTabRef = (el: HTMLButtonElement | null, index: number) => {
        if (el) {
            tabRefs.value[index] = el;
        }
    };

    const loadWorkflow = async (id: WorkflowId) => {
        const cached = workflowLoader.get(id);

        if (cached) {
            activeWorkflow.value = cached;
            panelState.value = "ready";
            return;
        }

        activeWorkflow.value = null;
        panelState.value = "loading";

        const result = await workflowLoader.load(id);

        if (activeTab.value !== id) {
            return;
        }

        if (result._tag === "loaded") {
            activeWorkflow.value = result.workflow;
            panelState.value = "ready";
            return;
        }

        panelState.value = "error";
    };

    const selectTab = async (id: WorkflowId, focusIndex?: number) => {
        if (!workflows.some((workflow) => workflow.id === id)) {
            return;
        }

        if (activeTab.value !== id) {
            activeTab.value = id;
            panelKey.value += 1;
        }

        const load = loadWorkflow(id);

        if (typeof focusIndex === "number") {
            await nextTick();
            tabRefs.value[focusIndex]?.focus();
        }

        await load;
    };

    const retryActiveWorkflow = () => {
        void loadWorkflow(activeTab.value);
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
            const nextWorkflow = workflows[nextIndex];

            if (!nextWorkflow) {
                return;
            }

            event.preventDefault();
            void selectTab(nextWorkflow.id, nextIndex);
        }
    };

    return {
        activeMetadata,
        activeTab,
        activeWorkflow,
        onTabKeydown,
        panelKey,
        panelState,
        retryActiveWorkflow,
        selectTab,
        setTabRef,
    };
};
