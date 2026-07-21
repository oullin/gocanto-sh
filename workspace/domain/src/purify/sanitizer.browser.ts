import createDOMPurify from "dompurify";

/** Sanitizes HTML and decodes HTML entities in browser environments. */
export class HtmlSanitizer {
    private static readonly purifier = createDOMPurify(window);
    private static readonly decodeContainer = document.createElement("textarea");

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
        HtmlSanitizer.decodeContainer.innerHTML = value;

        return HtmlSanitizer.decodeContainer.value;
    }
}
