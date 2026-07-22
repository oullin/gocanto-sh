import { describe, expect, it } from "vitest";

import { HtmlSanitizer } from "@gocanto/domain/purify";

const textCases = [
    ["&amp;", "&"],
    ["&lt;", "<"],
    ["&quot;", '"'],
    ["before &amp; after", "before & after"],
    ["&#169; &#x41;", "© A"],
    ["<p>one</p><p>two</p>", "one\n\ntwo"],
    ["a<br>b", "a\nb"],
    ['<img src=x onerror="alert(1)">Safe<script>alert(1)</script>', "Safe"],
] as const;

describe("HtmlSanitizer browser variant", () => {
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

    it("keeps only inline emphasis in sanitizeInline", () => {
        expect(
            HtmlSanitizer.sanitizeInline('<em class="x">kept</em><script>alert(1)</script>'),
        ).toBe("<em>kept</em>");
    });

    it("escapes text and attribute values in element", () => {
        expect(
            HtmlSanitizer.element("title", {}, 'a "&" <b>'),
        ).toBe(
            '<title>a "&amp;" &lt;b&gt;</title>',
        );
        expect(
            HtmlSanitizer.element("meta", { name: "description", content: 'a "&" b' }),
        ).toBe(
            '<meta name="description" content="a &quot;&amp;&quot; b">',
        );
    });
});
