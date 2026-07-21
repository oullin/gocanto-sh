import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import { workflows } from "#app/features/workflow-hero";
import WorkflowHero from "#app/components/WorkflowHero.vue";

describe("WorkflowHero", () => {
    it("renders a stable testimonial proof skeleton before recommendations load", () => {
        const wrapper = mount(WorkflowHero);
        const proofLink = wrapper.get(".wf-proof__users");

        expect(proofLink.attributes("aria-label")).toBe("View testimonials");
        expect(proofLink.attributes("aria-busy")).toBe("true");
        expect(wrapper.findAll(".wf-proof__avatar--skeleton")).toHaveLength(4);
        expect(wrapper.find(".wf-proof__label-skeleton").exists()).toBe(true);
    });

    it("renders workflow tabs from the aggregated workflow data", () => {
        const wrapper = mount(WorkflowHero);

        expect(wrapper.findAll('[role="tab"]').map((tab) => tab.text())).toEqual(
            workflows.map((workflow) => workflow.label),
        );
    });

    it("switches the active workflow panel", async () => {
        const wrapper = mount(WorkflowHero);
        const fintechTab = wrapper
            .findAll('[role="tab"]')
            .find((tab) => tab.text() === "Fintech Payments");

        expect(fintechTab).toBeDefined();

        await fintechTab?.trigger("click");

        expect(wrapper.get('[role="tabpanel"]').attributes("id")).toBe("wf-panel-meeting-prep");
        expect(wrapper.text()).toContain("Sandbox in 30 Minutes");
    });
});
