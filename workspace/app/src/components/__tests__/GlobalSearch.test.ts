import { flushPromises, mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { globalSearchOpen } from "@lib/globalSearch";
import GlobalSearch from "@components/GlobalSearch.vue";

describe("GlobalSearch", () => {
    beforeEach(() => {
        globalSearchOpen.value = true;
    });

    afterEach(() => {
        globalSearchOpen.value = false;
        document.body.innerHTML = "";
    });

    it("loads the corpus when mounted after search has already opened", async () => {
        globalSearchOpen.value = true;
        await nextTick();

        const wrapper = mount(GlobalSearch, {
            attachTo: document.body,
            global: {
                stubs: {
                    CommandDialog: {
                        template: "<div><slot /></div>",
                    },
                    CommandEmpty: {
                        template: "<div />",
                    },
                    CommandGroup: {
                        template: '<section data-slot="command-group"><slot /></section>',
                    },
                    CommandInput: {
                        template: '<input data-slot="command-input" />',
                    },
                    CommandItem: {
                        template: '<div data-slot="command-item"><slot /></div>',
                    },
                    CommandList: {
                        template: '<div data-slot="command-list"><slot /></div>',
                    },
                    SearchResultDetail: true,
                },
            },
        });

        for (let i = 0; i < 20 && wrapper.findAll('[data-slot="command-item"]').length === 0; i++) {
            await flushPromises();
            await nextTick();
            await new Promise((resolve) => window.setTimeout(resolve, 10));
        }

        expect(wrapper.findAll('[data-slot="command-item"]').length).toBeGreaterThan(0);
    });
});
