import { describe, expect, it } from "vitest";

import { HtmlSanitizer } from "@gocanto/domain/purify";

const cases = [
    ["&amp;", "&"],
    ["&lt;", "<"],
    ["&quot;", '"'],
    ["before &amp; after", "before & after"],
    ["&#169; &#x41;", "© A"],
] as const;

describe("HtmlSanitizer browser variant", () => {
    it.each(cases)("decodes %s", (input, expected) => {
        expect(
            HtmlSanitizer.decodeEntities(input),
        ).toBe(expected);
    });

    it("returns identical results across repeated calls", () => {
        const decodeAll = () => cases.map(([input]) => HtmlSanitizer.decodeEntities(input));

        expect(
            decodeAll(),
        ).toEqual(decodeAll());
    });
});
