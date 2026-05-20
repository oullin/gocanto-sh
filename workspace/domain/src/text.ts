import { decodeHtmlEntities, purify } from "@gocanto/domain/purify";

const lineBreakPlaceholder = "__GOCANTO_STRIP_HTML_LINE_BREAK__";
const paragraphBreakPlaceholder = "__GOCANTO_STRIP_HTML_PARAGRAPH_BREAK__";

export const stripHtml = (input: string): string => {
    const normalized = input
        .replace(/<br\s*\/?>/gi, lineBreakPlaceholder)
        .replace(/<\/p>\s*<p>/gi, paragraphBreakPlaceholder);

    const sanitized = purify.sanitize(normalized, {
        ALLOWED_ATTR: [],
        ALLOWED_TAGS: [],
    });

    return decodeHtmlEntities(sanitized)
        .replaceAll(lineBreakPlaceholder, "\n")
        .replaceAll(paragraphBreakPlaceholder, "\n\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
};

export const compactWhitespace = (input: string): string => input.replace(/\s+/g, " ").trim();

export const excerpt = (input: string, maxLength: number): string => {
    const clean = compactWhitespace(stripHtml(input));

    if (clean.length <= maxLength) {
        return clean;
    }

    return `${clean.slice(0, maxLength).trimEnd()}…`;
};

export const firstSentenceExcerpt = (input: string, maxLength: number): string => {
    const clean = compactWhitespace(stripHtml(input));
    const sentenceEnd = clean.search(/[.!?](\s|$)/);
    const firstSentence = sentenceEnd > 0 ? clean.slice(0, sentenceEnd + 1) : clean;

    if (firstSentence.length <= maxLength) {
        return firstSentence;
    }

    return `${firstSentence.slice(0, maxLength - 1).trimEnd()}…`;
};

export const searchableText = (...parts: readonly string[]): string => {
    const clean = compactWhitespace(stripHtml(parts.filter(Boolean).join(" ")));
    const compact = clean.replace(/[^A-Za-z0-9]+/g, "");

    return `${clean} ${compact}`;
};
