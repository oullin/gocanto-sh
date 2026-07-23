/** A reader's selected appearance mode. */
export type ThemeChoice = "system" | "light" | "dark";

/** The value persisted for VitePress; "auto" is its name for the system mode. */
export type Appearance = "auto" | "light" | "dark";

/**
 * Reads and writes the appearance value that VitePress's boot script and its
 * storage-backed `isDark` ref both consume under the same key.
 *
 * The value is written verbatim and a storage notification is emitted so
 * VitePress's VueUse `useDark` store adopts it directly. Assigning through that
 * boolean `isDark` ref instead would collapse an explicit "light"/"dark" that
 * happens to match the current OS theme back to "auto" — VueUse's `useDark`
 * setter normalizes a value equal to the system preference — silently
 * discarding the reader's manual choice on the next reload or OS theme change.
 */
export class ThemeMode {
    /** The storage key read by VitePress's appearance boot script. */
    static readonly storageKey = "vitepress-theme-appearance";

    private readonly storage: Pick<Storage, "getItem" | "setItem">;
    private readonly notify: (key: string, value: Appearance) => void;

    constructor(
        storage: Pick<Storage, "getItem" | "setItem">,
        notify: (key: string, value: Appearance) => void,
    ) {
        this.storage = storage;
        this.notify = notify;
    }

    /** Returns the reader's stored choice, defaulting to the system preference. */
    stored(): ThemeChoice {
        const value = this.storage.getItem(ThemeMode.storageKey);

        return value === "light" || value === "dark" ? value : "system";
    }

    /** Persists a choice verbatim and notifies VitePress's storage-backed ref. */
    persist(choice: ThemeChoice): void {
        const value: Appearance = choice === "system" ? "auto" : choice;

        this.storage.setItem(ThemeMode.storageKey, value);
        this.notify(ThemeMode.storageKey, value);
    }
}
