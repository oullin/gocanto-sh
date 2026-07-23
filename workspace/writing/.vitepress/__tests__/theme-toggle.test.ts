import { describe, expect, it } from "vitest";

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
    it("persists and resolves dark mode", () => {
        const storage = new MemoryStorage();
        const themeMode = new ThemeMode(storage, () => false);

        themeMode.persist("dark");

        expect(
            storage.getItem(ThemeMode.storageKey),
        ).toBe("dark");
        expect(
            themeMode.isDark("dark"),
        ).toBe(true);
    });

    it("persists and resolves light mode", () => {
        const storage = new MemoryStorage();
        const themeMode = new ThemeMode(storage, () => true);

        themeMode.persist("light");

        expect(
            storage.getItem(ThemeMode.storageKey),
        ).toBe("light");
        expect(
            themeMode.isDark("light"),
        ).toBe(false);
    });

    it("persists system mode and follows the system preference", () => {
        const storage = new MemoryStorage();
        const darkSystemMode = new ThemeMode(storage, () => true);
        const lightSystemMode = new ThemeMode(storage, () => false);

        darkSystemMode.persist("system");

        expect(
            storage.getItem(ThemeMode.storageKey),
        ).toBe("auto");
        expect(
            darkSystemMode.isDark("system"),
        ).toBe(true);
        expect(
            lightSystemMode.isDark("system"),
        ).toBe(false);
    });

    it("restores dark mode and treats other stored values as system mode", () => {
        const storage = new MemoryStorage();
        const themeMode = new ThemeMode(storage, () => false);

        storage.setItem(ThemeMode.storageKey, "dark");
        expect(
            themeMode.stored(),
        ).toBe("dark");

        storage.setItem(ThemeMode.storageKey, "auto");
        expect(
            themeMode.stored(),
        ).toBe("system");

        expect(
            new ThemeMode(new MemoryStorage(), () => false).stored(),
        ).toBe("system");

        storage.setItem(ThemeMode.storageKey, "garbage");
        expect(
            themeMode.stored(),
        ).toBe("system");
    });
});
