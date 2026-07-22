import { describe, expect, it } from "vitest";

import type { Post } from "#writing/posts";
import { WritingBundle } from "#writing/bundle";

const post: Post = {
    title: "Signed webhooks done right",
    url: "/signed-webhooks",
    canonicalUrl: "https://writing.gocanto.sh/signed-webhooks",
    date: { raw: "2026-07-18", display: "Jul 18, 2026", short: "Jul 18", year: "2026" },
    modifiedAt: "2026-07-22",
    image: "https://writing.gocanto.sh/og-image.png",
    readingTime: "4 min",
    description: "Signatures, freshness, and idempotency.",
    tags: ["webhooks", "payments"],
};

describe("WritingBundle.renderIndex", () => {
    it("links the canonical article, raw markdown, author, and resume", () => {
        const output = WritingBundle.renderIndex([post]);

        expect(output).toContain("https://writing.gocanto.sh/signed-webhooks");
        expect(output).toContain("https://writing.gocanto.sh/signed-webhooks.md");
        expect(output).toContain("https://gocanto.sh/");
        expect(output).toContain("https://gocanto.sh/resume");
    });
});
