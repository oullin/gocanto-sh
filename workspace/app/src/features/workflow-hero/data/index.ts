import { aiPlatformPayload } from "#app/features/workflow-hero/data/ai-platform";
import type { Workflow, WorkflowPayloadLoaders } from "#app/features/workflow-hero/types";

import {
    defaultWorkflowMetadata,
    workflowMetadata,
} from "#app/features/workflow-hero/data/metadata";

/** Complete default workflow, kept synchronous for first paint and SSR. */
export const defaultWorkflow: Workflow = {
    ...defaultWorkflowMetadata,
    ...aiPlatformPayload,
};

/** Deferred payload loaders for every inactive workflow tab. */
export const workflowPayloadLoaders: WorkflowPayloadLoaders = {
    "meeting-prep": async () =>
        (await import("#app/features/workflow-hero/data/fintech-payments")).fintechPaymentsPayload,
    "follow-ups": async () =>
        (await import("#app/features/workflow-hero/data/banking")).bankingPayload,
    "data-sync": async () =>
        (await import("#app/features/workflow-hero/data/event-pipelines")).eventPipelinesPayload,
    reporting: async () =>
        (await import("#app/features/workflow-hero/data/ecommerce")).ecommercePayload,
    "content-drafting": async () =>
        (await import("#app/features/workflow-hero/data/query-tuning")).queryTuningPayload,
};

export { workflowMetadata };
