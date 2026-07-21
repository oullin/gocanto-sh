import type { SearchPayload } from "@gocanto/domain/search";

/** Detail view concern represented by a search payload. */
export type DetailKind =
    | "work"
    | "project"
    | "skill"
    | "education"
    | "talk"
    | "recommendation"
    | "link";

/** Header content derived for a detail view. */
export type DetailHeader = {
    readonly kind: DetailKind;
    readonly label: SearchPayload["kind"];
    readonly title: string;
    readonly description: string;
    readonly avatar?: {
        readonly src: string;
        readonly alt: string;
    };
};
