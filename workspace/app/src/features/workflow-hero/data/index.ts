import { aiPlatformWorkflow } from "@features/workflow-hero/data/ai-platform";
import { bankingWorkflow } from "@features/workflow-hero/data/banking";
import { ecommerceWorkflow } from "@features/workflow-hero/data/ecommerce";
import { eventPipelinesWorkflow } from "@features/workflow-hero/data/event-pipelines";
import { fintechPaymentsWorkflow } from "@features/workflow-hero/data/fintech-payments";
import { queryTuningWorkflow } from "@features/workflow-hero/data/query-tuning";

import type { Workflow } from "@features/workflow-hero/types";

export const workflows = [
    aiPlatformWorkflow,
    fintechPaymentsWorkflow,
    bankingWorkflow,
    eventPipelinesWorkflow,
    ecommerceWorkflow,
    queryTuningWorkflow,
] as const satisfies readonly Workflow[];
