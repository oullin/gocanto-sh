import { HtmlSanitizer } from "@gocanto/domain/purify";

/** Provides pure text formatting transformations. */
export class TextFormatter {
    private static readonly lineBreakPlaceholder = "__GOCANTO_STRIP_HTML_LINE_BREAK__";
    private static readonly paragraphBreakPlaceholder = "__GOCANTO_STRIP_HTML_PARAGRAPH_BREAK__";

    private constructor() {}

    /**
     * Removes HTML while preserving paragraph and line boundaries.
     *
     * @param input - HTML or text input, including nullish values.
     * @returns Plain decoded text.
     */
    public static stripHtml(input: string | null | undefined): string {
        const normalized = (input ?? "")
            .replace(/<br\s*\/?>/gi, TextFormatter.lineBreakPlaceholder)
            .replace(/<\/p>\s*<p>/gi, TextFormatter.paragraphBreakPlaceholder);

        const sanitized = HtmlSanitizer.sanitize(normalized);

        return HtmlSanitizer.decodeEntities(sanitized)
            .replaceAll(TextFormatter.lineBreakPlaceholder, "\n")
            .replaceAll(TextFormatter.paragraphBreakPlaceholder, "\n\n")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
    }

    /**
     * Collapses whitespace into single spaces.
     *
     * @param input - Text to compact.
     * @returns Compacted text.
     */
    public static compactWhitespace(input: string): string {
        return input.replace(/\s+/g, " ").trim();
    }

    /**
     * Produces a length-limited plain-text excerpt.
     *
     * @param input - HTML or text input.
     * @param maxLength - Maximum content length before appending an ellipsis.
     * @returns A compact plain-text excerpt.
     */
    public static excerpt(input: string, maxLength: number): string {
        const clean = TextFormatter.compactWhitespace(TextFormatter.stripHtml(input));

        if (clean.length <= maxLength) {
            return clean;
        }

        return `${clean.slice(0, maxLength).trimEnd()}…`;
    }

    /**
     * Produces a length-limited excerpt from the first sentence.
     *
     * @param input - HTML or text input.
     * @param maxLength - Maximum returned length including the ellipsis.
     * @returns The first sentence or its truncated form.
     */
    public static firstSentence(input: string, maxLength: number): string {
        const clean = TextFormatter.compactWhitespace(TextFormatter.stripHtml(input));
        const sentenceEnd = clean.search(/[.!?](\s|$)/);
        const firstSentence = sentenceEnd > 0 ? clean.slice(0, sentenceEnd + 1) : clean;

        if (firstSentence.length <= maxLength) {
            return firstSentence;
        }

        return `${firstSentence.slice(0, maxLength - 1).trimEnd()}…`;
    }

    /**
     * Creates searchable text with both readable and punctuation-free variants.
     *
     * @param parts - Text fragments to combine.
     * @returns Searchable text containing readable and compact variants.
     */
    public static searchable(...parts: readonly string[]): string {
        const clean = TextFormatter.compactWhitespace(
            TextFormatter.stripHtml(parts.filter(Boolean).join(" ")),
        );

        const compact = clean.replace(/[^A-Za-z0-9]+/g, "");

        return `${clean} ${compact}`;
    }
}
