import { afterEach, describe, expect, it, vi } from "vitest";

import { Site } from "#search/site";

const ORIGIN = "https://writing.gocanto.sh";

const PAGES: Record<string, string> = {
    [`${ORIGIN}/llms.txt`]: `- [Post](${ORIGIN}/post)\n  - [Raw Markdown](${ORIGIN}/post.md)\n`,
    [`${ORIGIN}/post.md`]: "---\ntitle: A post\n---\nBody text.",
};

/**
 * Stands in for the remote site and, like workerd, rejects a call where
 * `this` is anything other than the global scope.
 */
function strictFetch(this: unknown, input: RequestInfo | URL): Promise<Response> {
    if (this !== undefined && this !== globalThis) {
        return Promise.reject(new TypeError("Illegal invocation"));
    }

    const body = PAGES[String(input)];

    return Promise.resolve(new Response(body ?? "", { status: body === undefined ? 404 : 200 }));
}

describe("Site", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("calls the global fetch unbound by default", async () => {
        vi.stubGlobal("fetch", strictFetch);

        expect(await new Site(ORIGIN).posts()).toEqual([
            { body: "Body text.", title: "A post", url: "/post" },
        ]);
    });
});
