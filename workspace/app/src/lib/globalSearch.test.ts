// @vitest-environment node
import { beforeEach, describe, expect, it } from "vitest";

import { useGlobalSearch } from "#app/lib/globalSearch";

const { open, openSearch } = useGlobalSearch();

describe("globalSearch", () => {
    beforeEach(() => {
        open.value = false;
    });

    it("starts closed", () => {
        expect(open.value).toBe(false);
    });

    it("openSearch flips the flag to true", () => {
        openSearch();
        expect(open.value).toBe(true);
    });
});
