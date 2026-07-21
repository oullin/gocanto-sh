import { describe, expect, it } from "vitest";

import * as purifyModule from "@gocanto/domain/purify";

const cases = [
    ["&amp;", "&"],
    ["&lt;", "<"],
    ["&quot;", '"'],
    ["before &amp; after", "before & after"],
    ["&#169; &#x41;", "© A"],
] as const;

describe("purify browser variant", () => {
    it("exports the shared purify API shape", () => {
        expect(Object.keys(purifyModule).sort()).toEqual(["decodeHtmlEntities", "purify"]);
    });

    it.each(cases)("decodes %s", (input, expected) => {
        expect(purifyModule.decodeHtmlEntities(input)).toBe(expected);
    });

    it("returns identical results across repeated calls", () => {
        const decodeAll = () => cases.map(([input]) => purifyModule.decodeHtmlEntities(input));

        expect(decodeAll()).toEqual(decodeAll());
    });
});
