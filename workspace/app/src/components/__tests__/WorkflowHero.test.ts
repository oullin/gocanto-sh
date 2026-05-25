import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import WorkflowHero from "../WorkflowHero.vue";

describe("WorkflowHero", () => {
    it("renders a stable testimonial proof skeleton before recommendations load", () => {
        const wrapper = mount(WorkflowHero);
        const proofLink = wrapper.get(".wf-proof__users");

        expect(proofLink.attributes("aria-label")).toBe("View testimonials");
        expect(proofLink.attributes("aria-busy")).toBe("true");
        expect(wrapper.findAll(".wf-proof__avatar--skeleton")).toHaveLength(4);
        expect(wrapper.find(".wf-proof__label-skeleton").exists()).toBe(true);
    });
});
