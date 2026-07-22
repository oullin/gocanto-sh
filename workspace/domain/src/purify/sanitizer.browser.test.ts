/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from "vitest";

import { HtmlSanitizer } from "./sanitizer.browser.js";

const textCases = [
    ["&amp;", "&"],
    ["&lt;", "<"],
    ["&quot;", '"'],
    ["before &amp; after", "before & after"],
    ["&#169; &#x41;", "© A"],
    ["<b>Test</b>", "Test"],
    ["<script>alert(1)</script>Test", "Test"],
    ['<a href="javascript:alert(1)">Test</a>', "Test"],
    ["<img src=x onerror=alert(1)>Test", "Test"],
    ["Hello &amp; <b>World</b>", "Hello & World"],
    ["<p>one</p><p>two</p>", "one\n\ntwo"],
    ["a<br>b", "a\nb"],
] as const;

describe("Browser HtmlSanitizer.toText", () => {
    it.each(textCases)("reduces %s to text", (input, expected) => {
        expect(
            HtmlSanitizer.toText(input),
        ).toBe(expected);
    });

    it("returns identical results across repeated calls", () => {
        const textAll = () => textCases.map(([input]) => HtmlSanitizer.toText(input));

        expect(
            textAll(),
        ).toEqual(textAll());
    });
});

describe("Browser HtmlSanitizer.sanitizeInline", () => {
    it("keeps inline emphasis and drops everything else", () => {
        expect(
            HtmlSanitizer.sanitizeInline('<em class="x">kept</em><script>alert(1)</script>'),
        ).toBe("<em>kept</em>");
    });
});

describe("Browser HtmlSanitizer.element", () => {
    it("escapes text and attribute values", () => {
        expect(
            HtmlSanitizer.element("title", {}, 'a "&" <b>'),
        ).toBe(
            '<title>a "&amp;" &lt;b&gt;</title>',
        );
        expect(
            HtmlSanitizer.element("meta", { content: 'a "&" b', name: "description" }),
        ).toBe(
            '<meta content="a &quot;&amp;&quot; b" name="description">',
        );
    });
});
