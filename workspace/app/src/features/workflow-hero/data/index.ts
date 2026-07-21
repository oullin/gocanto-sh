import { aiPlatformWorkflow } from "#app/features/workflow-hero/data/ai-platform";
import { bankingWorkflow } from "#app/features/workflow-hero/data/banking";
import { ecommerceWorkflow } from "#app/features/workflow-hero/data/ecommerce";
import { eventPipelinesWorkflow } from "#app/features/workflow-hero/data/event-pipelines";
import { fintechPaymentsWorkflow } from "#app/features/workflow-hero/data/fintech-payments";
import { queryTuningWorkflow } from "#app/features/workflow-hero/data/query-tuning";

import type { Workflow } from "#app/features/workflow-hero";

/** Curated workflow definitions displayed by the workflow hero. */
export const workflows = [
    aiPlatformWorkflow,
    fintechPaymentsWorkflow,
    bankingWorkflow,
    eventPipelinesWorkflow,
    ecommerceWorkflow,
    queryTuningWorkflow,
] as const satisfies readonly Workflow[];
