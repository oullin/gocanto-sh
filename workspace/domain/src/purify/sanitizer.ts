import createDOMPurify from "dompurify";
import type { DOMPurify, WindowLike } from "dompurify";

/** A window-like object that also exposes the document DOMPurify sanitizes into. */
export type SanitizerWindow = WindowLike & { document: Document };

/**
 * DOMPurify-backed HTML handling.
 *
 * Every HTML decision — what markup survives, how text is escaped for output —
 * is delegated to DOMPurify and the DOM serializer rather than to regular
 * expressions or a hand-written entity table.
 */
export class DomSanitizer {
    private static readonly elementNode = 1;
    private static readonly textNode = 3;
    private static readonly inlineTags = ["b", "em", "i", "strong"];

    private readonly purifier: DOMPurify;
    private readonly document: Document;

    /**
     * Binds a sanitizer to a DOM implementation.
     *
     * @param window - The window whose document backs sanitization and serialization.
     */
    public constructor(window: SanitizerWindow) {
        this.purifier = createDOMPurify(window);
        this.document = window.document;
    }

    /**
     * Sanitizes HTML down to a minimal set of inline formatting tags.
     *
     * @param html - HTML content to sanitize.
     * @returns HTML safe to render, retaining only inline emphasis tags.
     */
    public sanitizeInline(html: string): string {
        return this.purifier.sanitize(html, {
            ALLOWED_ATTR: [],
            ALLOWED_TAGS: DomSanitizer.inlineTags,
        });
    }

    /**
     * Strips all markup and returns decoded plain text.
     *
     * Paragraph and line-break boundaries survive as newlines.
     *
     * @param html - HTML content to reduce to text.
     * @returns Decoded plain text.
     */
    public toText(html: string): string {
        const fragment = this.purifier.sanitize(html, {
            ALLOWED_ATTR: [],
            ALLOWED_TAGS: ["br", "p"],
            RETURN_DOM_FRAGMENT: true,
        });

        return this.textOf(fragment)
            .replace(/\n{3,}/g, "\n\n")
            .trim();
    }

    /**
     * Serializes an element, leaving all escaping to the DOM serializer.
     *
     * @param tag - The tag name to create.
     * @param attributes - Attribute names mapped to their raw values.
     * @param text - Optional text content for the element.
     * @returns The serialized element.
     */
    public element(tag: string, attributes: Record<string, string>, text?: string): string {
        const element = this.document.createElement(tag);

        for (const [name, value] of Object.entries(attributes)) {
            element.setAttribute(name, value);
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element.outerHTML;
    }

    private textOf(node: Node): string {
        if (node.nodeType === DomSanitizer.textNode) {
            return node.nodeValue ?? "";
        }

        const inner = Array.from(node.childNodes, (child) => this.textOf(child)).join("");

        if (node.nodeType !== DomSanitizer.elementNode) {
            return inner;
        }

        const tag = (node as Element).tagName.toLowerCase();

        if (tag === "br") {
            return "\n";
        }

        return tag === "p" ? `${inner}\n\n` : inner;
    }
}
