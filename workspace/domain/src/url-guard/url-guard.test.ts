import { describe, expect, it } from "vitest";

import { UrlGuard } from "#domain/url-guard/url-guard";

describe("UrlGuard", () => {
    it("allows HTTPS URLs", () => {
        expect(
            UrlGuard.safeHref("https://example.com/path"),
        ).toBe("https://example.com/path");
    });

    it("rejects JavaScript URLs", () => {
        expect(
            UrlGuard.safeHref("javascript:alert(1)"),
        ).toBeUndefined();
    });

    it("allows mailto URLs", () => {
        expect(
            UrlGuard.safeHref("mailto:hello@example.com"),
        ).toBe("mailto:hello@example.com");
    });

    it("rejects malformed and relative URLs", () => {
        expect(
            UrlGuard.safeHref("not a URL"),
        ).toBeUndefined();
        expect(
            UrlGuard.safeHref("/relative-path"),
        ).toBeUndefined();
    });
});
