// @vitest-environment node
import { beforeEach, describe, expect, it } from "vitest";

import { globalSearchOpen, openGlobalSearch } from "./globalSearch";

describe("globalSearch", () => {
    beforeEach(() => {
        globalSearchOpen.value = false;
    });

    it("starts closed", () => {
        expect(globalSearchOpen.value).toBe(false);
    });

    it("openGlobalSearch flips the flag to true", () => {
        openGlobalSearch();
        expect(globalSearchOpen.value).toBe(true);
    });
});
