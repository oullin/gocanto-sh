import { describe, expect, it, vi } from "vitest";

import { defaultWorkflow, workflowMetadata } from "@features/workflow-hero/data";
import { WorkflowLoader } from "@features/workflow-hero/WorkflowLoader";

import type { WorkflowPayload } from "@features/workflow-hero/types";

const deferredPayload: WorkflowPayload = {
    connectors: [],
    steps: [],
};

describe("WorkflowLoader", () => {
    it("loads an inactive workflow once and reuses the cached value", async () => {
        const loadFintech = vi.fn(async () => deferredPayload);
        const loader = new WorkflowLoader(workflowMetadata, defaultWorkflow, {
            "meeting-prep": loadFintech,
        });

        const first = await loader.load("meeting-prep");
        const second = await loader.load("meeting-prep");

        expect(first._tag).toBe("loaded");
        expect(second._tag).toBe("loaded");
        expect(loadFintech).toHaveBeenCalledTimes(1);
        expect(loader.get("meeting-prep")?.label).toBe("Fintech Payments");
    });

    it("contains rejection and permits a fresh retry", async () => {
        const loadBanking = vi
            .fn<() => Promise<WorkflowPayload>>()
            .mockRejectedValueOnce(new Error("chunk unavailable"))
            .mockResolvedValueOnce(deferredPayload);
        const loader = new WorkflowLoader(workflowMetadata, defaultWorkflow, {
            "follow-ups": loadBanking,
        });

        const failed = await loader.load("follow-ups");
        const retried = await loader.load("follow-ups");

        expect(failed._tag).toBe("failed");
        expect(retried._tag).toBe("loaded");
        expect(loadBanking).toHaveBeenCalledTimes(2);
    });
});
