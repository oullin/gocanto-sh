const APP_DIV_OPEN = '<div id="app">';
const APP_DIV_CLOSE = "</div>";
const BODY_CLOSE = "</body>";

/**
 * Splices prerendered SSR HTML into a built `dist/index.html` template.
 *
 * Locates the `<div id="app">...</div>` region that immediately precedes
 * `</body>` and replaces its (empty) contents with the server-rendered
 * markup, leaving the rest of the template untouched.
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
     * @returns The template with `appHtml` spliced between the app div markers.
     * @throws When `<div id="app">` cannot be located in the template.
     */
    inject(appHtml: string): string {
        const appStart = this.template.indexOf(APP_DIV_OPEN);
        const bodyEnd = this.template.lastIndexOf(BODY_CLOSE);
        const appEnd = bodyEnd > appStart ? this.template.lastIndexOf(APP_DIV_CLOSE, bodyEnd) : -1;

        if (appStart === -1 || appEnd === -1) {
            throw new Error('[prerender] could not locate <div id="app"> in dist/index.html');
        }

        return `${this.template.slice(0, appStart)}${APP_DIV_OPEN}${appHtml}${APP_DIV_CLOSE}${this.template.slice(
            appEnd + APP_DIV_CLOSE.length,
        )}`;
    }
}
