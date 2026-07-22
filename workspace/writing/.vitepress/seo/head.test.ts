import { describe, expect, it } from "vitest";

import { WritingSeoHead } from "#writing/seo";

describe("WritingSeoHead", () => {
    it("builds canonical Blog metadata for the index", () => {
        const head = new WritingSeoHead({
            relativePath: "index.md",
            title: "Gustavo Ocanto: Writing",
            description: "Field notes.",
            frontmatter: {},
        }).build();

        const serialized = JSON.stringify(head);
        const jsonLd = String(head.find((entry) => entry[0] === "script")?.[2]);

        expect(serialized).toContain("https://writing.gocanto.sh/");
        expect(jsonLd).toContain('"@type":"Blog"');
        expect(serialized).toContain('"content":"website"');
    });

    it("builds page-specific BlogPosting metadata", () => {
        const head = new WritingSeoHead({
            relativePath: "posts/signed-webhooks.md",
            title: "Signed webhooks done right",
            description: "Signatures, freshness, and idempotency.",
            frontmatter: {
                date: "2026-07-18",
                updated: "2026-07-22",
                tags: ["webhooks", "payments"],
            },
        }).build();

        const serialized = JSON.stringify(head);
        const jsonLd = String(head.find((entry) => entry[0] === "script")?.[2]);

        expect(serialized).toContain("https://writing.gocanto.sh/signed-webhooks");
        expect(serialized).toContain('"content":"article"');
        expect(jsonLd).toContain('"@type":"BlogPosting"');
        expect(jsonLd).toContain('"dateModified":"2026-07-22"');
        expect(serialized).toContain("https://gocanto.sh/#person");
    });

    it("keeps the article canonical and Open Graph URL equal", () => {
        const head = new WritingSeoHead({
            relativePath: "posts/payment-retries.md",
            title: "Payment retries",
            description: "Recovering ambiguous outcomes.",
            frontmatter: { date: "2026-07-22" },
        }).build();

        const serialized = JSON.stringify(head);
        const canonical = "https://writing.gocanto.sh/payment-retries";

        expect(serialized).toContain(`"rel":"canonical","href":"${canonical}"`);
        expect(serialized).toContain(`"property":"og:url","content":"${canonical}"`);
    });

    it("falls back to the shared image and publication date", () => {
        const head = new WritingSeoHead({
            relativePath: "posts/payment-retries.md",
            title: "Payment retries",
            description: "Recovering ambiguous outcomes.",
            frontmatter: {
                date: "2026-07-22",
                updated: "not-a-date",
                image: "",
            },
        }).build();

        const serialized = JSON.stringify(head);
        const jsonLd = String(head.find((entry) => entry[0] === "script")?.[2]);

        expect(serialized).toContain("https://writing.gocanto.sh/og-image.png");
        expect(jsonLd).toContain('"datePublished":"2026-07-22"');
        expect(jsonLd).toContain('"dateModified":"2026-07-22"');
    });

    it("normalizes VitePress ISO datetime frontmatter into article dates", () => {
        const head = new WritingSeoHead({
            relativePath: "posts/signed-webhooks.md",
            title: "Signed webhooks done right",
            description: "Signatures, freshness, and idempotency.",
            frontmatter: {
                date: "2026-07-18T00:00:00.000Z",
                updated: "2026-07-22T00:00:00.000Z",
            },
        }).build();

        const serialized = JSON.stringify(head);
        const jsonLd = String(head.find((entry) => entry[0] === "script")?.[2]);

        expect(serialized).toContain('"property":"article:published_time","content":"2026-07-18"');
        expect(serialized).toContain('"property":"article:modified_time","content":"2026-07-22"');
        expect(jsonLd).toContain('"datePublished":"2026-07-18"');
        expect(jsonLd).toContain('"dateModified":"2026-07-22"');
    });
});
