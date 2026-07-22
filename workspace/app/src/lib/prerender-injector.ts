const APP_DIV_OPEN = '<div id="app">';
const APP_DIV_CLOSE = "</div>";
const NOT_FOUND_ERROR_MESSAGE = '[prerender] could not locate <div id="app"> in dist/index.html';

/**
 * Splices prerendered SSR HTML into a built `dist/index.html` template.
 *
 * Locates the `<div id="app">...</div>` region by scanning forward from the
 * opening tag and tracking nested `<div>` depth until it returns to zero, so
 * the app div's OWN closing tag is matched regardless of any sibling markup
 * (other divs, scripts, etc.) that follows it inside `<body>`. It then
 * replaces the app div's contents with the server-rendered markup, leaving
 * the rest of the template untouched.
 */
export class PrerenderInjector {
    private readonly template: string;

    constructor(template: string) {
        this.template = template;
    }

    /**
     * Inject `appHtml` into the template's `<div id="app">` region.
     *
     * @param appHtml - The server-rendered HTML to inject.
     * @returns The template with `appHtml` spliced between the app div's own opening and closing tags.
     * @throws When `<div id="app">` cannot be located, or its matching closing tag cannot be found.
     */
    inject(appHtml: string): string {
        const appStart = this.template.indexOf(APP_DIV_OPEN);

        if (appStart === -1) {
            throw new Error(NOT_FOUND_ERROR_MESSAGE);
        }

        const contentStart = appStart + APP_DIV_OPEN.length;
        const appEnd = this.findOwnClosingTag(contentStart);

        if (appEnd === -1) {
            throw new Error(NOT_FOUND_ERROR_MESSAGE);
        }

        return `${this.template.slice(0, appStart)}${APP_DIV_OPEN}${appHtml}${APP_DIV_CLOSE}${this.template.slice(
            appEnd + APP_DIV_CLOSE.length,
        )}`;
    }

    /**
     * Scan forward from `contentStart` — the index immediately after the app
     * div's opening tag — tracking nested `<div>` depth, and return the
     * index of the `</div>` that brings depth back to zero. That closing
     * tag belongs to the app div itself, not to any div nested inside it.
     *
     * @param contentStart - The index immediately after `<div id="app">`.
     * @returns The index of the app div's own `</div>`, or -1 if depth never returns to zero.
     */
    private findOwnClosingTag(contentStart: number): number {
        const divTag = /<div(?=[\s>])|<\/div>/g;

        divTag.lastIndex = contentStart;

        let depth = 1;
        let match: RegExpExecArray | null;

        while ((match = divTag.exec(this.template)) !== null) {
            if (match[0] !== APP_DIV_CLOSE) {
                depth += 1;
                continue;
            }

            depth -= 1;

            if (depth === 0) {
                return match.index;
            }
        }

        return -1;
    }
}
