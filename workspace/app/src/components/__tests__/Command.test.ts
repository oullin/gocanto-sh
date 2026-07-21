import { mount } from "@vue/test-utils";
import { defineComponent, nextTick, ref } from "vue";
import { describe, expect, it } from "vitest";

import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "#app/components/ui/command";

const SearchHarness = defineComponent(
	{
	    components: {
	        Command,
	        CommandGroup,
	        CommandInput,
	        CommandItem,
	        CommandList,
	    },
	    setup() {
	        const showLateItem = ref(false);

	        return {
	            showLateItem,
	        };
	    },
	    template: `
				        <Command>
				            <CommandInput placeholder="Search" />
				            <button type="button" data-test="show-late" @click="showLateItem = true">Show late item</button>
				            <CommandList>
				                <CommandGroup heading="Projects">
				                    <CommandItem value="visible-only" search-value="python data pipelines">
				                        Payments Platform
				                    </CommandItem>
				                    <CommandItem value="hidden-only" search-value="golang services">
				                        Ledger Service
				                    </CommandItem>
				                    <CommandItem v-if="showLateItem" value="late-only" search-value="python automations">
				                        Automation Toolkit
				                    </CommandItem>
				                </CommandGroup>
				            </CommandList>
				        </Command>
				    `,
	},
);

describe("Command", () => {
    it("filters items using explicit search values instead of visible labels", async () => {
        const wrapper = mount(SearchHarness);

        await wrapper.get('[data-slot="command-input"]').setValue("python");

        await nextTick();

        expect(
        	wrapper.text(),
        ).toContain("Payments Platform");
        expect(
        	wrapper.text(),
        ).not.toContain("Ledger Service");
    });

    it("refreshes filtering when matching items mount after the query is entered", async () => {
        const wrapper = mount(SearchHarness);

        await wrapper.get('[data-slot="command-input"]').setValue("python");

        await nextTick();

        expect(
        	wrapper.text(),
        ).not.toContain("Automation Toolkit");

        await wrapper.get('[data-test="show-late"]').trigger("click");

        await nextTick();

        expect(
        	wrapper.text(),
        ).toContain("Automation Toolkit");
    });
});
