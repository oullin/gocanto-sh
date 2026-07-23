import { describe, expect, it, vi } from "vitest";

import { ThemeMode } from "../theme/theme-mode";

class MemoryStorage implements Pick<Storage, "getItem" | "setItem"> {
    private readonly values = new Map<string, string>();

    getItem(key: string): string | null {
        return this.values.get(key) ?? null;
    }

    setItem(key: string, value: string): void {
        this.values.set(key, value);
    }
}

describe("ThemeMode", () => {
    it("persists an explicit dark choice verbatim and notifies", () => {
        const storage = new MemoryStorage();
        const notify = vi.fn();
        const themeMode = new ThemeMode(storage, notify);

        themeMode.persist("dark");

        expect(
            storage.getItem(ThemeMode.storageKey),
        ).toBe("dark");
        expect(notify).toHaveBeenCalledWith(ThemeMode.storageKey, "dark");
    });

    it("persists an explicit light choice verbatim and notifies", () => {
        const storage = new MemoryStorage();
        const notify = vi.fn();
        const themeMode = new ThemeMode(storage, notify);

        themeMode.persist("light");

        expect(
            storage.getItem(ThemeMode.storageKey),
        ).toBe("light");
        expect(notify).toHaveBeenCalledWith(ThemeMode.storageKey, "light");
    });

    // The regression this guards: an explicit choice must reach storage as
    // "light"/"dark", never a boolean routed through VitePress's isDark ref,
    // which would rewrite a choice matching the OS to "auto".
    it("persists system mode as auto and notifies", () => {
        const storage = new MemoryStorage();
        const notify = vi.fn();
        const themeMode = new ThemeMode(storage, notify);

        themeMode.persist("system");

        expect(
            storage.getItem(ThemeMode.storageKey),
        ).toBe("auto");
        expect(notify).toHaveBeenCalledWith(ThemeMode.storageKey, "auto");
    });

    it("restores explicit choices and treats auto, missing, and unknown as system", () => {
        const storage = new MemoryStorage();
        const themeMode = new ThemeMode(storage, () => {});

        storage.setItem(ThemeMode.storageKey, "dark");
        expect(
            themeMode.stored(),
        ).toBe("dark");

        storage.setItem(ThemeMode.storageKey, "light");
        expect(
            themeMode.stored(),
        ).toBe("light");

        storage.setItem(ThemeMode.storageKey, "auto");
        expect(
            themeMode.stored(),
        ).toBe("system");

        expect(
            new ThemeMode(new MemoryStorage(), () => {}).stored(),
        ).toBe("system");

        storage.setItem(ThemeMode.storageKey, "garbage");
        expect(
            themeMode.stored(),
        ).toBe("system");
    });
});
