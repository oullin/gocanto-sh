import { describe, expect, it } from "vitest";

import type { AuthorityPageRecord } from "@gocanto/store";
import { AuthorityStructuredDataBuilder, PageMetadataInjector } from "#app/lib/page-metadata";

const page: AuthorityPageRecord = {
    kind: "expertise",
    path: "/expertise/payments",
    title: "Payment Systems Architecture | Gustavo Ocanto",
    description: "Payment systems built for retries.",
    eyebrow: "Expertise",
    heading: "Payments",
    lead: "Reliable payments.",
    updated_at: "2026-07-22",
    proof: [],
    sections: [],
    related_writing: [],
};

const routeTemplate = `<html><head>
    <meta name="description" content="old" />
    <link rel="canonical" href="https://gocanto.sh/" />
    <link rel="alternate" href="https://gocanto.sh/" hreflang="en-US" />
    <link rel="alternate" href="https://gocanto.sh/" hreflang="x-default" />
    <meta property="og:title" content="old" />
    <meta property="og:description" content="old" />
    <meta property="og:type" content="profile" />
    <meta property="og:url" content="https://gocanto.sh/" />
    <meta property="og:image" content="old" />
    <meta property="og:image:secure_url" content="old" />
    <meta property="og:image:alt" content="old" />
    <meta name="twitter:title" content="old" />
    <meta name="twitter:description" content="old" />
    <meta name="twitter:image" content="old" />
    <meta name="twitter:image:alt" content="old" />
    <title>Old</title><script><!--__JSONLD__--></script>
</head></html>`;

describe("AuthorityStructuredDataBuilder", () => {
    it("links expertise pages to the canonical Person entity", () => {
        const output = new AuthorityStructuredDataBuilder(page).toScriptContents();

        expect(output).toContain('"@type": "WebPage"');
        expect(output).toContain("https://gocanto.sh/#person");
        expect(output).toContain('"@type": "BreadcrumbList"');
    });
});

describe("PageMetadataInjector", () => {
    it("applies a unique title, canonical, description, and JSON-LD", () => {
        const output = new PageMetadataInjector(routeTemplate).inject({
            path: page.path,
            title: page.title,
            description: page.description,
            type: "website",
            image: "https://gocanto.sh/og-image.png",
            structuredData: '{"ok":true}',
        });

        expect(output).toContain(`<title>${page.title}</title>`);
        expect(output).toContain('href="https://gocanto.sh/expertise/payments"');
        expect(output).toContain('{"ok":true}');
    });

    it("escapes route metadata before inserting it into HTML", () => {
        const output = new PageMetadataInjector(routeTemplate).inject({
            path: page.path,
            title: 'Payments & "recovery" <patterns>',
            description: 'Retries & "reconciliation" <first>',
            type: "website",
            image: "https://gocanto.sh/og-image.png",
            structuredData: '{"ok":true}',
        });

        expect(output).toContain(
            "<title>Payments &amp; &quot;recovery&quot; &lt;patterns&gt;</title>",
        );
        expect(output).toContain(
            'content="Retries &amp; &quot;reconciliation&quot; &lt;first&gt;"',
        );
    });
});
