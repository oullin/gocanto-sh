import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import { bio } from "@gocanto/store";

import WhoIAm from "#app/components/WhoIAm.vue";

vi.mock("#app/lib/useAsyncInView", () => ({ useInViewReady: () => true }));

describe("WhoIAm", () => {
    it("renders the inline emphasis carried by the bio copy", () => {
        const wrapper = mount(WhoIAm);
        const emphasised = wrapper.findAll(".bio-body p em").map((node) => node.text());

        expect(emphasised.length).toBeGreaterThan(0);
        expect(emphasised[0]).toBe("I write software that handles real money and real customers.");
    });

    it("renders every bio paragraph as text", () => {
        const wrapper = mount(WhoIAm);
        const rendered = wrapper.findAll(".bio-body > p");

        expect(rendered.length).toBe(bio.data.paragraphs.length);
        expect(
            rendered[1]?.text(),
        ).toContain("Valencia, Venezuela");
    });

    it("emits no markup beyond the sanitizer's inline tag set", () => {
        const html = mount(WhoIAm)
            .find(".bio-body")
            .html();

        const tags = new Set(
            Array.from(html.matchAll(/<([a-z][a-z0-9]*)/gi), (match) => match[1].toLowerCase()),
        );

        expect(
            tags.has("script"),
        ).toBe(false);
        expect(html).not.toContain("onerror");
    });
});
