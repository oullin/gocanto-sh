import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import { profile } from "@gocanto/store";

import HeroCta from "#app/components/HeroCta.vue";

describe("HeroCta", () => {
    it("renders a mailto link pointing at the profile email", () => {
        const wrapper = mount(HeroCta);
        const link = wrapper.get("a.pill");

        expect(
        	link.attributes("href"),
        ).toBe(`mailto:${profile.data.email}`);
        expect(
        	link.text(),
        ).toContain("Get in touch");
    });
});
