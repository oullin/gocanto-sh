import { AVATAR_BASE_URL } from "@gocanto/domain/kernel";
import type { SearchPayload } from "@gocanto/domain/search";
import { TextFormatter } from "@gocanto/domain/text";

import type { DetailHeader } from "#domain/detail/types";

/** Provides pure transformations for search-result detail views. */
export class DetailView {
    private constructor() {}

    /**
     * Derives a detail header from a search payload.
     *
     * @param payload - Search payload to present, or null.
     * @returns A detail header, or null when no payload is selected.
     */
    public static headerFor(payload: SearchPayload | null): DetailHeader | null {
        if (!payload) {
            return null;
        }

        switch (payload.kind) {
            case "Work":
                return {
                    kind: "work",
                    label: payload.kind,
                    title: `${payload.data.position} · ${payload.data.company}`,
                    description: `${payload.data.start_date} – ${payload.data.end_date} · ${payload.data.employment_type} · ${payload.data.city}, ${payload.data.country}`,
                };

            case "Project":
                return {
                    kind: "project",
                    label: payload.kind,
                    title: payload.data.title,
                    description: `${payload.data.language}${payload.data.is_open_source ? " · Open source" : ""}`,
                };

            case "Skill":
                return {
                    kind: "skill",
                    label: payload.kind,
                    title: payload.data.item,
                    description: `Proficiency ${payload.data.percentage}%`,
                };

            case "Education":
                return {
                    kind: "education",
                    label: payload.kind,
                    title: `${payload.data.degree} · ${payload.data.field}`,
                    description: `${payload.data.school} · Graduated ${payload.data.graduated_at} · ${payload.data.issuing_country}`,
                };

            case "Talk":
                return {
                    kind: "talk",
                    label: payload.kind,
                    title: payload.data.title,
                    description: `${payload.data.subject} · ${payload.data.location}`,
                };

            case "Recommendation":
                return {
                    kind: "recommendation",
                    label: payload.kind,
                    title: payload.data.person.full_name,
                    description: `${payload.data.person.designation} · ${payload.data.person.company}`,
                    avatar: {
                        src: `${AVATAR_BASE_URL}${payload.data.person.avatar}`,
                        alt: payload.data.person.full_name,
                    },
                };

            case "Link":
                return {
                    kind: "link",
                    label: payload.kind,
                    title: payload.data.name,
                    description: payload.data.handle,
                };
        }
    }

    /**
     * Converts HTML into non-empty detail paragraphs.
     *
     * @param html - HTML content to split.
     * @returns Plain-text paragraphs.
     */
    public static paragraphs(html: string): readonly string[] {
        return TextFormatter.stripHtml(html)
            .split("\n\n")
            .filter(Boolean);
    }

    /**
     * Splits a comma-separated value into trimmed non-empty items.
     *
     * @param input - Comma-separated text.
     * @returns Trimmed non-empty list items.
     */
    public static commaList(input: string): readonly string[] {
        return input
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }
}
