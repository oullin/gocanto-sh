import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import { bankingPayload } from "#app/features/workflow-hero/data/banking";
import { defaultWorkflow, workflowMetadata } from "#app/features/workflow-hero/data";
import WorkflowHero from "#app/features/workflow-hero/WorkflowHero.vue";
import { WorkflowLoader } from "#app/features/workflow-hero/WorkflowLoader";

import type { WorkflowPayload } from "#app/features/workflow-hero/types";

describe("WorkflowHero deferred panels", () => {
    it("renders the default workflow without a loading transition", () => {
        const wrapper = mount(WorkflowHero);

        expect(
            wrapper.text(),
        ).toContain("Ollin Agent Go");
        expect(
            wrapper.find('[aria-label="Loading workflow"]').exists(),
        ).toBe(false);
    });

    it("shows a contained error and retries a rejected chunk load", async () => {
        const loadBanking = vi
            .fn<() => Promise<WorkflowPayload>>()
            .mockRejectedValueOnce(new Error("chunk unavailable"))
            .mockResolvedValueOnce(bankingPayload);

        const workflowLoader = new WorkflowLoader(workflowMetadata, defaultWorkflow, {
            "follow-ups": loadBanking,
        });

        const wrapper = mount(
            WorkflowHero,
            { props: { workflowLoader } },
        );

        const bankingTab = wrapper.findAll('[role="tab"]').find((tab) => tab.text() === "Banking");

        await bankingTab?.trigger("click");

        await flushPromises();

        expect(
            wrapper.get('[role="alert"]').text(),
        ).toContain(
            "This workflow could not be loaded.",
        );

        await wrapper.get('[role="alert"] button').trigger("click");

        await flushPromises();

        expect(loadBanking).toHaveBeenCalledTimes(2);
        expect(
            wrapper.find('[role="alert"]').exists(),
        ).toBe(false);
        expect(
            wrapper.text(),
        ).toContain("Legacy Surface");
    });
});
