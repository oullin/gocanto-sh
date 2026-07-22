/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from "vitest";

import { HtmlSanitizer } from "./sanitizer.browser.js";

const decodeCases = [
    ["&amp;", "&"],
    ["&lt;", "<"],
    ["&quot;", '"'],
    ["before &amp; after", "before & after"],
    ["&#169; &#x41;", "© A"],
] as const;

describe("Browser HtmlSanitizer.decodeEntities", () => {
    it.each(decodeCases)("decodes %s", (input, expected) => {
        expect(
            HtmlSanitizer.decodeEntities(input),
        ).toBe(expected);
    });

    it("returns identical results across repeated calls", () => {
        const decodeAll = () => decodeCases.map(([input]) => HtmlSanitizer.decodeEntities(input));

        expect(
            decodeAll(),
        ).toEqual(decodeAll());
    });
});

const sanitizeCases = [
    ["<b>Test</b>", "Test"],
    ["<script>alert(1)</script>Test", "Test"],
    ['<a href="javascript:alert(1)">Test</a>', "Test"],
    ["<img src=x onerror=alert(1)>Test", "Test"],
    ["Hello &amp; <b>World</b>", "Hello &amp; World"],
] as const;

describe("Browser HtmlSanitizer.sanitize", () => {
    it.each(sanitizeCases)("sanitizes %s", (input, expected) => {
        expect(
            HtmlSanitizer.sanitize(input),
        ).toBe(expected);
    });
});
