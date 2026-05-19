import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ThemeToggle from "../ThemeToggle.vue";

const stubMatchMedia = (matches: boolean) => {
    const mql: Partial<MediaQueryList> = {
        matches,
        media: "(prefers-color-scheme: dark)",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
        onchange: null,
    };

    window.matchMedia = vi.fn().mockReturnValue(mql as MediaQueryList);
};

const createMemoryStorage = (): Storage => {
    const store = new Map<string, string>();

    return {
        get length() {
            return store.size;
        },
        clear: () => store.clear(),
        getItem: (key) => store.get(key) ?? null,
        key: (index) => Array.from(store.keys())[index] ?? null,
        removeItem: (key) => {
            store.delete(key);
        },
        setItem: (key, value) => {
            store.set(key, String(value));
        },
    };
};

describe("ThemeToggle", () => {
    beforeEach(() => {
        vi.stubGlobal("localStorage", createMemoryStorage());
        delete (document.documentElement.dataset as Record<string, string | undefined>).theme;
        stubMatchMedia(false);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("defaults to system mode and applies light when prefers-color-scheme is light", async () => {
        const wrapper = mount(ThemeToggle);

        await flushPromises();

        const systemRadio = wrapper.get('input[value="system"]');
        const darkRadio = wrapper.get('input[value="dark"]');

        expect((systemRadio.element as HTMLInputElement).checked).toBe(true);
        expect((darkRadio.element as HTMLInputElement).checked).toBe(false);
        expect(document.documentElement.dataset.theme).toBe("light");
    });

    it("hydrates from localStorage when a theme is stored", async () => {
        localStorage.setItem("theme", "dark");
        const wrapper = mount(ThemeToggle);

        await flushPromises();

        const darkRadio = wrapper.get('input[value="dark"]');

        expect((darkRadio.element as HTMLInputElement).checked).toBe(true);
        expect(document.documentElement.dataset.theme).toBe("dark");
    });

    it("persists explicit selections and clears storage when reverting to system", async () => {
        const wrapper = mount(ThemeToggle);

        await flushPromises();

        await wrapper.get('input[value="dark"]').setValue();
        expect(localStorage.getItem("theme")).toBe("dark");
        expect(document.documentElement.dataset.theme).toBe("dark");

        await wrapper.get('input[value="system"]').setValue();
        expect(localStorage.getItem("theme")).toBeNull();
        expect(document.documentElement.dataset.theme).toBe("light");
    });
});
