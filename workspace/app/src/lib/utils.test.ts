import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
    it("merges conflicting Tailwind utilities, last value wins", () => {
        expect(cn("p-2", "p-4")).toBe("p-4");
    });

    it("drops falsy inputs", () => {
        expect(cn("p-2", false, null, undefined, "")).toBe("p-2");
    });

    it("dedupes identical classes", () => {
        expect(cn("text-sm", "text-sm")).toBe("text-sm");
    });

    it("applies conditional object syntax", () => {
        expect(cn("base", { active: true, disabled: false })).toBe("base active");
    });
});
