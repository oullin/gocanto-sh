import createDOMPurify from "dompurify";
import type { WindowLike } from "dompurify";
import { JSDOM } from "jsdom";

/** Sanitizes HTML and decodes HTML entities in Node.js environments. */
export class HtmlSanitizer {
    private static readonly purifyWindow = new JSDOM("").window;

    // SAFETY: JSDOM's Window implements the DOM surface DOMPurify requires at runtime.
    private static readonly purifier = createDOMPurify(
        HtmlSanitizer.purifyWindow as unknown as WindowLike,
    );

    private static readonly decodeContainer =
        HtmlSanitizer.purifyWindow.document.createElement("textarea");

    private constructor() {}

    /**
     * Removes all HTML tags and attributes from a string.
     *
     * @param html - HTML content to sanitize.
     * @returns Sanitized text with HTML entities still encoded.
     */
    public static sanitize(html: string): string {
        return HtmlSanitizer.purifier.sanitize(html, {
            ALLOWED_ATTR: [],
            ALLOWED_TAGS: [],
        });
    }

    /**
     * Decodes HTML entities into their text representation.
     *
     * @param value - Text containing encoded HTML entities.
     * @returns Text with HTML entities decoded.
     */
    public static decodeEntities(value: string): string {
        HtmlSanitizer.decodeContainer.innerHTML = HtmlSanitizer.sanitize(value);

        return HtmlSanitizer.decodeContainer.value;
    }
}
