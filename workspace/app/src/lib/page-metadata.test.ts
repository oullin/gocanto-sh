import { describe, expect, it } from "vitest";

import { PageMetadataInjector } from "#app/lib/page-metadata";

const template = `<html><head>
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

const metadata = {
    path: "/example/nested-path",
    title: "Payment Systems Architecture | Gustavo Ocanto",
    description: "Payment systems built for retries.",
    type: "website",
    image: "https://gocanto.sh/og-image.png",
    structuredData: '{"ok":true}',
} as const;

describe("PageMetadataInjector", () => {
    it("applies a unique title, canonical, description, and JSON-LD", () => {
        const output = new PageMetadataInjector(template).inject(metadata);

        expect(output).toContain(`<title>${metadata.title}</title>`);
        expect(output).toContain('href="https://gocanto.sh/example/nested-path"');
        expect(output).toContain('{"ok":true}');
    });

    it("strips markup from metadata and escapes what is left", () => {
        const output = new PageMetadataInjector(template).inject({
            ...metadata,
            title: 'Payments "&" <b>tags</b>',
        });

        expect(output).toContain('<title>Payments "&amp;" tags</title>');
        expect(output).toContain('content="Payments &quot;&amp;&quot; tags"');
        expect(output).not.toContain("<b>tags</b>");
    });

    it("does not treat replacement patterns in metadata as capture references", () => {
        const output = new PageMetadataInjector(template).inject({
            ...metadata,
            title: "Cost $& savings $1",
            structuredData: '{"note":"$&"}',
        });

        expect(output).toContain("<title>Cost $&amp; savings $1</title>");
        expect(output).toContain('content="Cost $&amp; savings $1"');
        expect(output).toContain('{"note":"$&"}');
    });

    it("throws when the template is missing a metadata tag it must rewrite", () => {
        const withoutDescription = template.replace(/<meta name="description"[^>]*>/, "");

        expect(() => new PageMetadataInjector(withoutDescription).inject(metadata)).toThrow(
            "missing name=description metadata tag",
        );
    });

    it("throws when the JSON-LD marker is absent", () => {
        const withoutMarker = template.replace("<!--__JSONLD__-->", "");

        expect(() => new PageMetadataInjector(withoutMarker).inject(metadata)).toThrow(
            "could not locate JSON-LD marker",
        );
    });
});
