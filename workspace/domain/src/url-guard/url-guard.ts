/** Guards URLs before they are exposed through navigable link attributes. */
export class UrlGuard {
    private static readonly allowedProtocols = new Set(["http:", "https:", "mailto:"]);

    private constructor() {}

    /**
     * Returns an absolute URL when its scheme is safe for navigation.
     *
     * @param url - The candidate URL.
     * @returns The original URL for allowlisted schemes, or `undefined` otherwise.
     */
    static safeHref(url: string): string | undefined {
        try {
            const parsed = new URL(url);

            return UrlGuard.allowedProtocols.has(parsed.protocol) ? url : undefined;
        } catch {
            return undefined;
        }
    }
}
