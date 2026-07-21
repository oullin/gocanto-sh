import { nextTick } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";

import { defaultWorkflow, workflowMetadata } from "#app/features/workflow-hero/data";
import { useWorkflowTabs } from "#app/features/workflow-hero/useWorkflowTabs";
import { WorkflowLoader } from "#app/features/workflow-hero/WorkflowLoader";

describe("useWorkflowTabs", () => {
    afterEach(() => {
        document.body.replaceChildren();
    });

    it("loads an inactive tab once and uses its cache on reactivation", async () => {
        const loadFintech = vi.fn(async () => ({ connectors: [], steps: [] }));

        const loader = new WorkflowLoader(workflowMetadata, defaultWorkflow, {
            "meeting-prep": loadFintech,
        });

        const tabs = useWorkflowTabs(workflowMetadata, loader);

        await tabs.selectTab("meeting-prep");

        await tabs.selectTab("lead-qualifier");

        await tabs.selectTab("meeting-prep");

        expect(loadFintech).toHaveBeenCalledTimes(1);
        expect(tabs.activeWorkflow.value?.id).toBe("meeting-prep");
        expect(tabs.panelState.value).toBe("ready");
    });

    it("preserves arrow-key activation and focus movement", async () => {
        const loader = new WorkflowLoader(workflowMetadata, defaultWorkflow, {
            "meeting-prep": async () => ({ connectors: [], steps: [] }),
        });

        const tabs = useWorkflowTabs(workflowMetadata, loader);
        const firstTab = document.createElement("button");
        const secondTab = document.createElement("button");

        document.body.append(firstTab, secondTab);
        tabs.setTabRef(firstTab, 0);
        tabs.setTabRef(secondTab, 1);
        firstTab.focus();

        const event = new KeyboardEvent("keydown", {
            key: "ArrowRight",
            cancelable: true,
        });

        tabs.onTabKeydown(event, 0);

        await nextTick();

        expect(event.defaultPrevented).toBe(true);
        expect(tabs.activeTab.value).toBe("meeting-prep");
        expect(document.activeElement).toBe(secondTab);
    });
});
