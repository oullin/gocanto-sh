import { FileText, Gauge, Landmark, PenLine, ServerCog, Wand2 } from "lucide-vue-next";

import type { Workflow } from "#app/features/workflow-hero";

/** Banking case study shown in the workflow hero. */
export const bankingWorkflow: Workflow = {
    id: "follow-ups",
    label: "Banking",
    icon: Landmark,
    connectors: [
        {
            x: 404,
            y: 310,
            width: 71,
            height: 15,
            viewBox: "0 0 71 15",
            diamond: "M6 1.35791L12 7.35791L6 13.3579L0 7.35791L6 1.35791Z",
            line: "M6 7.35791H70",
            arrow: "M63.4941 1L69.8768 7.35817L63.4944 13.7158",
            delay: "middle",
        },
        {
            x: 798,
            y: 310,
            width: 71,
            height: 15,
            viewBox: "0 0 71 15",
            diamond: "M6 1.35791L12 7.35791L6 13.3579L0 7.35791L6 1.35791Z",
            line: "M6 7.35791H70",
            arrow: "M63.4941 1L69.8768 7.35817L63.4944 13.7158",
            delay: "late",
        },
    ],
    steps: [
        {
            id: "follow-input",
            label: "Input",
            labelIcon: PenLine,
            icon: Landmark,
            title: "Legacy Surface",
            description:
                "One AS/400, VCOS, Java monolith, or core-banking surface is scoped for a fixed pilot.",
            details: [
                { text: "Sparse docs + sample records" },
                { text: "Security and compliance stakeholders" },
            ],
            time: "Discovery",
            delay: "early",
            position: "left",
        },
        {
            id: "follow-action",
            label: "Modernize",
            labelIcon: Wand2,
            icon: ServerCog,
            title: "Proxy + Controls",
            description:
                "toku.sh wraps the legacy system with a modern API while preserving auditability and operational control.",
            details: [
                { text: "Go reverse proxy + OpenAPI" },
                { text: "Auth, cache, rate limits, circuit breaker" },
                { text: "Kafka projection when needed" },
            ],
            chip: "AS/400 protected",
            time: "8-12 weeks",
            delay: "middle",
            position: "center",
        },
        {
            id: "follow-output",
            label: "Output",
            labelIcon: FileText,
            icon: Gauge,
            title: "Operational Console",
            description:
                "Bank teams get traffic, latency, AS/400 health, audit export, and rollback runbooks.",
            details: [
                { text: "p50/p95/p99 latency" },
                { text: "Caller + operation audit filters" },
                { text: "Compliance pack" },
            ],
            time: "Pilot-ready",
            delay: "late",
            position: "right",
        },
    ],
};
