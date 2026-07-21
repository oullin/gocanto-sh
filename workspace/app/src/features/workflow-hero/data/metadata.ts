import { Bot, Cable, CreditCard, Landmark, ShoppingCart, TrendingUp } from "lucide-vue-next";

import type { WorkflowMetadata } from "@features/workflow-hero/types";

/** Metadata for the workflow rendered on first paint. */
export const defaultWorkflowMetadata: WorkflowMetadata = {
    id: "lead-qualifier",
    label: "AI Platform",
    icon: Bot,
};

/** Lightweight workflow tab registry, ordered as displayed in the hero. */
export const workflowMetadata = [
    defaultWorkflowMetadata,
    { id: "meeting-prep", label: "Fintech Payments", icon: CreditCard },
    { id: "follow-ups", label: "Banking", icon: Landmark },
    { id: "data-sync", label: "Event Pipelines", icon: Cable },
    { id: "reporting", label: "Ecommerce", icon: ShoppingCart },
    { id: "content-drafting", label: "Query Tuning", icon: TrendingUp },
] as const satisfies readonly WorkflowMetadata[];
