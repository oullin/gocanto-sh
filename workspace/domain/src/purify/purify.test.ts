import { describe, expect, it } from "vitest";

import { HtmlSanitizer } from "@gocanto/domain/purify";

describe("HtmlSanitizer.toText", () => {
    it.each([
        ["&amp;", "&"],
        ["&lt;", "<"],
        ["&quot;", '"'],
        ["before &amp; after", "before & after"],
        ["&#169; &#x41;", "© A"],
    ])("decodes %s", (input, expected) => {
        expect(
            HtmlSanitizer.toText(input),
        ).toBe(expected);
    });

    it.each([
        ["<p>one</p><p>two</p>", "one\n\ntwo"],
        ['<p class="lede">one<br />two</p>', "one\ntwo"],
        ["a<br>b<br>c", "a\nb\nc"],
        ["<p>one</p>\n\n\n<p>two</p>", "one\n\ntwo"],
    ])("keeps block boundaries in %s", (input, expected) => {
        expect(
            HtmlSanitizer.toText(input),
        ).toBe(expected);
    });

    it.each([
        ["<b>bold</b>", "bold"],
        ["<script>alert(1)</script>", ""],
        ['<a href="https://example.com">link</a>', "link"],
        ['<img src="x" onerror="alert(1)">', ""],
        ['<img src=x onerror="alert(1)">Safe<script>alert(1)</script>', "Safe"],
    ])("drops unsafe markup in %s", (input, expected) => {
        expect(
            HtmlSanitizer.toText(input),
        ).toBe(expected);
    });

    it("returns identical results across repeated calls", () => {
        const run = () => ["&amp;", "<p>one</p><p>two</p>"].map((v) => HtmlSanitizer.toText(v));

        expect(
            run(),
        ).toEqual(run());
    });
});

describe("HtmlSanitizer.sanitizeInline", () => {
    it("keeps inline emphasis tags", () => {
        expect(
            HtmlSanitizer.sanitizeInline("plain <em>emphasis</em> and <strong>weight</strong>"),
        ).toBe("plain <em>emphasis</em> and <strong>weight</strong>");
    });

    it("strips attributes, block tags, and scripts", () => {
        expect(
            HtmlSanitizer.sanitizeInline('<em class="x" onclick="alert(1)">kept</em>'),
        ).toBe(
            "<em>kept</em>",
        );
        expect(
            HtmlSanitizer.sanitizeInline(
                '<a href="https://evil.test">link</a><script>x()</script>',
            ),
        ).toBe("link");
    });
});

describe("HtmlSanitizer.element", () => {
    it("escapes text content", () => {
        expect(
            HtmlSanitizer.element("title", {}, 'Payments "&" <b>tags</b>'),
        ).toBe(
            '<title>Payments "&amp;" &lt;b&gt;tags&lt;/b&gt;</title>',
        );
    });

    it("escapes attribute values", () => {
        expect(
            HtmlSanitizer.element("meta", {
                content: 'quote " amp & close">',
                name: "description",
            }),
        ).toBe('<meta content="quote &quot; amp &amp; close&quot;>" name="description">');
    });
});
