import { Bot, FileText, PackageCheck, PenLine, Wand2 } from "lucide-vue-next";

import type { Workflow } from "#app/features/workflow-hero";

/** AI-platform case study shown in the workflow hero. */
export const aiPlatformWorkflow: Workflow = {
    id: "lead-qualifier",
    label: "AI Platform",
    icon: Bot,
    connectors: [
        {
            x: 394,
            y: 196,
            width: 121,
            height: 87,
            viewBox: "0 0 121 87",
            diamond: "M6 0L12 6L6 12L0 6L6 0Z",
            line: "M6 6H93.2683C104.314 6 113.268 14.9543 113.268 26V85.671",
            arrow: "M106.91 79.2884L113.268 85.671L119.626 79.2887",
            delay: "middle",
        },
        {
            x: 727,
            y: 248,
            width: 151,
            height: 121,
            viewBox: "0 0 151 121",
            diamond: "M6 108.626L12 114.626L6 120.626L0 114.626L6 108.626Z",
            line: "M6 114.626V27.3579C6 16.3122 14.9543 7.35791 26 7.35791H149.146",
            arrow: "M142.763 1L149.145 7.35817L142.763 13.7158",
            delay: "late",
        },
    ],
    steps: [
        {
            id: "lead-input",
            label: "Source",
            labelIcon: PenLine,
            icon: Bot,
            title: "Ollin Agent Go",
            description: "Shared platform for fixed-scope AI delivery in regulated systems.",
            details: [
                { text: "Orchestrator and tool registry" },
                { text: "Markdown knowledge base loader" },
                { text: "Signed JSONL audit log" },
            ],
            chip: "Platform foundation",
            time: "Build once",
            delay: "early",
            position: "left",
        },
        {
            id: "lead-action",
            label: "Agent",
            labelIcon: Wand2,
            icon: Wand2,
            title: "Generate, Validate, Replay",
            description:
                "Claude handles the first pass, GPT-4 is available as fallback, and validators fail closed before anything ships.",
            details: [
                { text: "Provider abstraction" },
                { text: "Structured output" },
                { text: "Build, test, lint, security gates" },
            ],
            chip: "Agent-accelerated",
            time: "Hours, not days",
            model: true,
            modelLabel: "Claude + GPT-4 fallback",
            delay: "middle",
            position: "center",
        },
        {
            id: "lead-output",
            label: "Deliverable",
            labelIcon: FileText,
            icon: PackageCheck,
            title: "Reviewable Client Package",
            description:
                "Senior-engineer code, tests, docs, runbooks, and audit evidence delivered as a fixed-scope sprint.",
            details: [
                { text: "README and API reference" },
                { text: "Reproducible artifact manifest" },
                { text: "Audit trail for review" },
            ],
            chip: "Production-grade",
            time: "Fixed scope",
            action: "Ready for review",
            delay: "late",
            position: "right",
        },
    ],
};
