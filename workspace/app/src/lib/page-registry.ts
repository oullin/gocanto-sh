import { authorityPages } from "@gocanto/store";
import type { AuthorityPageRecord } from "@gocanto/store";

/** Resolves the finite set of public prerendered profile routes. */
export class AppPageRegistry {
    private constructor() {}

    public static all(): readonly AuthorityPageRecord[] {
        return authorityPages.data;
    }

    public static resolve(path: string): AuthorityPageRecord | undefined {
        const normalized = path === "/" ? path : path.replace(/\/$/, "");

        return authorityPages.data.find((page) => page.path === normalized);
    }
}
