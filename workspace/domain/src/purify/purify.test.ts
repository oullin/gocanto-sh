import { describe, expect, it } from "vitest";

import { HtmlSanitizer } from "@gocanto/domain/purify";

const cases = [
    ["&amp;", "&"],
    ["&lt;", "<"],
    ["&quot;", '"'],
    ["before &amp; after", "before & after"],
    ["&#169; &#x41;", "© A"],
] as const;

describe("HtmlSanitizer.sanitize", () => {
    const sanitizeCases = [
        ["<b>bold</b>", "bold"],
        ["<script>alert(1)</script>", ""],
        ['<a href="https://example.com">link</a>', "link"],
        ["<b>&amp;</b>", "&amp;"],
        ['<img src="x" onerror="alert(1)">', ""],
    ] as const;

    it.each(sanitizeCases)("sanitizes %s", (input, expected) => {
        expect(
            HtmlSanitizer.sanitize(input),
        ).toBe(expected);
    });

    it("returns identical results across repeated calls", () => {
        const sanitizeAll = () => sanitizeCases.map(([input]) => HtmlSanitizer.sanitize(input));

        expect(
            sanitizeAll(),
        ).toEqual(sanitizeAll());
    });
});

describe("HtmlSanitizer.decodeEntities", () => {
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
