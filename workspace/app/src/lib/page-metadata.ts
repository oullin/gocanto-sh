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

        let html = this.template.replace(
            /<title>[\s\S]*?<\/title>/,
            `<title>${this.escape(metadata.title)}</title>`,
        );

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
        html = html.replace(
            /<link rel="canonical" href="[^"]+"\s*\/?>/,
            `<link rel="canonical" href="${canonical}" />`,
        );
        html = html.replace(
            /<link rel="alternate" href="[^"]+" hreflang="en-US"\s*\/?>/,
            `<link rel="alternate" href="${canonical}" hreflang="en-US" />`,
        );
        html = html.replace(
            /<link rel="alternate" href="[^"]+" hreflang="x-default"\s*\/?>/,
            `<link rel="alternate" href="${canonical}" hreflang="x-default" />`,
        );

        if (!html.includes("<!--__JSONLD__-->")) {
            throw new Error("[prerender] could not locate JSON-LD marker in route template");
        }

        return html.replace("<!--__JSONLD__-->", metadata.structuredData);
    }

    private replaceMeta(
        html: string,
        attribute: "name" | "property",
        key: string,
        content: string,
    ): string {
        const pattern = new RegExp(`<meta\\s+(?=[^>]*${attribute}="${key}")[^>]*>`, "i");
        const tag = `<meta ${attribute}="${key}" content="${this.escape(content)}" />`;

        if (!pattern.test(html)) {
            throw new Error(`[prerender] missing ${attribute}=${key} metadata tag`);
        }

        return html.replace(pattern, tag);
    }

    private escape(value: string): string {
        return value
            .replaceAll("&", "&amp;")
            .replaceAll('"', "&quot;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;");
    }
}
