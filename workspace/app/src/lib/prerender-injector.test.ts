// @vitest-environment node
import { describe, expect, it } from "vitest";

import { PrerenderInjector } from "@lib/prerender-injector";

describe("PrerenderInjector", () => {
    it("injects app HTML between the app div markers and preserves the rest of the template", () => {
        const template =
            '<html><head><title>x</title></head><body><div id="app"></div><script src="/main.js"></script></body></html>';

        const injected = new PrerenderInjector(template).inject("<p>hello</p>");

        expect(injected).toBe(
            '<html><head><title>x</title></head><body><div id="app"><p>hello</p></div><script src="/main.js"></script></body></html>',
        );
    });

    it("throws when the <div id=\"app\"> marker is missing", () => {
        const template = "<html><body></body></html>";

        expect(() => new PrerenderInjector(template).inject("<p>hello</p>")).toThrow(
            '[prerender] could not locate <div id="app"> in dist/index.html',
        );
    });

    it("throws when the closing </div>/</body> markers are missing", () => {
        const template = '<html><body><div id="app">';

        expect(() => new PrerenderInjector(template).inject("<p>hello</p>")).toThrow(
            '[prerender] could not locate <div id="app"> in dist/index.html',
        );
    });

    it("does not clobber sibling elements that follow the app div", () => {
        const template =
            '<html><body><div id="app"></div><div id="portal"></div><script src="/main.js"></script></body></html>';

        const injected = new PrerenderInjector(template).inject("<p>hello</p>");

        expect(injected).toBe(
            '<html><body><div id="app"><p>hello</p></div><div id="portal"></div><script src="/main.js"></script></body></html>',
        );
    });

    it("replaces the app div's own contents when it already contains nested divs", () => {
        const template =
            '<html><body><div id="app"><div class="shell"><div></div></div></div><script src="/main.js"></script></body></html>';

        const injected = new PrerenderInjector(template).inject("<p>hello</p>");

        expect(injected).toBe(
            '<html><body><div id="app"><p>hello</p></div><script src="/main.js"></script></body></html>',
        );
    });
});
