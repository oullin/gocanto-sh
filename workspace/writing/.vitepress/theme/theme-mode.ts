/** A reader's selected appearance mode. */
export type ThemeChoice = "system" | "light" | "dark";

/** Wraps VitePress's appearance storage contract for the theme toggle. */
export class ThemeMode {
    /** The storage key read by VitePress's appearance boot script. */
    static readonly storageKey = "vitepress-theme-appearance";

    private readonly storage: Pick<Storage, "getItem" | "setItem">;
    private readonly systemDark: () => boolean;

    constructor(storage: Pick<Storage, "getItem" | "setItem">, systemDark: () => boolean) {
        this.storage = storage;
        this.systemDark = systemDark;
    }

    /** Returns the reader's stored choice, defaulting to the system preference. */
    stored(): ThemeChoice {
        const value = this.storage.getItem(ThemeMode.storageKey);

        return value === "light" || value === "dark" ? value : "system";
    }

    /** Resolves whether the supplied choice should render the dark theme. */
    isDark(choice: ThemeChoice): boolean {
        if (choice === "system") {
            return this.systemDark();
        }

        return choice === "dark";
    }

    /** Persists a choice using the values expected by VitePress. */
    persist(choice: ThemeChoice): void {
        this.storage.setItem(ThemeMode.storageKey, choice === "system" ? "auto" : choice);
    }
}
