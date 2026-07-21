import { aiPlatformPayload } from "@features/workflow-hero/data/ai-platform";
import { defaultWorkflowMetadata, workflowMetadata } from "@features/workflow-hero/data/metadata";

import type { Workflow, WorkflowPayloadLoaders } from "@features/workflow-hero/types";

/** Complete default workflow, kept synchronous for first paint and SSR. */
export const defaultWorkflow: Workflow = {
    ...defaultWorkflowMetadata,
    ...aiPlatformPayload,
};

/** Deferred payload loaders for every inactive workflow tab. */
export const workflowPayloadLoaders: WorkflowPayloadLoaders = {
    "meeting-prep": async () =>
        (await import("@features/workflow-hero/data/fintech-payments")).fintechPaymentsPayload,
    "follow-ups": async () => (await import("@features/workflow-hero/data/banking")).bankingPayload,
    "data-sync": async () =>
        (await import("@features/workflow-hero/data/event-pipelines")).eventPipelinesPayload,
    reporting: async () =>
        (await import("@features/workflow-hero/data/ecommerce")).ecommercePayload,
    "content-drafting": async () =>
        (await import("@features/workflow-hero/data/query-tuning")).queryTuningPayload,
};

export { workflowMetadata };
