export const stripHtml = (input: string): string =>
    input
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>\s*<p>/gi, "\n\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

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
