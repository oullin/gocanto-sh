import { JSDOM } from "jsdom";

import { DomSanitizer } from "#domain/purify/sanitizer";
import type { SanitizerWindow } from "#domain/purify/sanitizer";

export { DomSanitizer } from "#domain/purify/sanitizer";

/** Sanitizes HTML against a JSDOM document. */
// SAFETY: JSDOM's Window implements the DOM surface DOMPurify requires at runtime.
export const HtmlSanitizer = new DomSanitizer(new JSDOM("").window as unknown as SanitizerWindow);
