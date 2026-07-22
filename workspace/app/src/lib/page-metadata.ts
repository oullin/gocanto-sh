import { HtmlSanitizer } from "@gocanto/domain/purify";

import { SITE_URL } from "#app/lib/site";

export interface AppPageMetadata {
    readonly path: string;
    readonly title: string;
    readonly description: string;
    readonly type: "profile" | "website";
    readonly image: string;
    readonly structuredData: string;
}

/** Applies route-specific metadata to the Vite-built HTML shell. */
export class PageMetadataInjector {
    public constructor(private readonly template: string) {}

    public inject(metadata: AppPageMetadata): string {
        const canonical = new URL(metadata.path, SITE_URL).toString();

        const title = HtmlSanitizer.element("title", {}, HtmlSanitizer.toText(metadata.title));

        let html = PageMetadataInjector.swap(this.template, /<title>[\s\S]*?<\/title>/, title);

        html = this.replaceMeta(html, "name", "description", metadata.description);
        html = this.replaceMeta(html, "property", "og:title", metadata.title);
        html = this.replaceMeta(html, "property", "og:description", metadata.description);
        html = this.replaceMeta(html, "property", "og:type", metadata.type);
        html = this.replaceMeta(html, "property", "og:url", canonical);
        html = this.replaceMeta(html, "property", "og:image", metadata.image);
        html = this.replaceMeta(html, "property", "og:image:secure_url", metadata.image);
        html = this.replaceMeta(html, "property", "og:image:alt", metadata.title);
        html = this.replaceMeta(html, "name", "twitter:title", metadata.title);
        html = this.replaceMeta(html, "name", "twitter:description", metadata.description);
        html = this.replaceMeta(html, "name", "twitter:image", metadata.image);
        html = this.replaceMeta(html, "name", "twitter:image:alt", metadata.title);
        html = PageMetadataInjector.swap(
            html,
            /<link rel="canonical" href="[^"]+"\s*\/?>/,
            HtmlSanitizer.element("link", { rel: "canonical", href: canonical }),
        );

        for (const hreflang of ["en-US", "x-default"]) {
            html = PageMetadataInjector.swap(
                html,
                new RegExp(`<link rel="alternate" href="[^"]+" hreflang="${hreflang}"\\s*/?>`),
                HtmlSanitizer.element("link", { rel: "alternate", href: canonical, hreflang }),
            );
        }

        if (!html.includes("<!--__JSONLD__-->")) {
            throw new Error("[prerender] could not locate JSON-LD marker in route template");
        }

        return PageMetadataInjector.swap(html, "<!--__JSONLD__-->", metadata.structuredData);
    }

    private replaceMeta(
        html: string,
        attribute: "name" | "property",
        key: string,
        content: string,
    ): string {
        const pattern = new RegExp(`<meta\\s+(?=[^>]*${attribute}="${key}")[^>]*>`, "i");

        if (!pattern.test(html)) {
            throw new Error(`[prerender] missing ${attribute}=${key} metadata tag`);
        }

        const tag = HtmlSanitizer.element("meta", {
            [attribute]: key,
            content: HtmlSanitizer.toText(content),
        });

        return PageMetadataInjector.swap(html, pattern, tag);
    }

    // A replacer function keeps `$&` and friends in the injected value literal.
    private static swap(html: string, pattern: RegExp | string, value: string): string {
        return html.replace(pattern, () => value);
    }
}
