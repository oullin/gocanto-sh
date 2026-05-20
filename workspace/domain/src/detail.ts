import { AVATAR_BASE_URL } from "./recommendations";
import type { SearchPayload } from "./search";
import { stripHtml } from "./text";

export type DetailKind =
    | "work"
    | "project"
    | "skill"
    | "education"
    | "talk"
    | "recommendation"
    | "link";

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

export const detailHeaderFor = (payload: SearchPayload | null): DetailHeader | null => {
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
};

export const detailParagraphs = (html: string): readonly string[] =>
    stripHtml(html).split("\n\n").filter(Boolean);

export const commaList = (input: string): readonly string[] =>
    input
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
