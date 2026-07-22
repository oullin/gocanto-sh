import { DomSanitizer } from "#domain/purify/sanitizer";

export { DomSanitizer } from "#domain/purify/sanitizer";

/** Sanitizes HTML against the live browser DOM. */
export const HtmlSanitizer = new DomSanitizer(window);
