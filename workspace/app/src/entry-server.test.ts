import { describe, expect, it } from "vitest";

import { render } from "./entry-server";

describe("entry-server", () => {
    it("renders the app to a non-empty HTML string without throwing", async () => {
        const html = await render();

        expect(html.length).toBeGreaterThan(1000);
        expect(html).toContain("Gustavo");
    });
});
