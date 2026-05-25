import { aiPlatformWorkflow } from "./ai-platform";
import { bankingWorkflow } from "./banking";
import { ecommerceWorkflow } from "./ecommerce";
import { eventPipelinesWorkflow } from "./event-pipelines";
import { fintechPaymentsWorkflow } from "./fintech-payments";
import { queryTuningWorkflow } from "./query-tuning";

import type { Workflow } from "../types";

export const workflows = [
    aiPlatformWorkflow,
    fintechPaymentsWorkflow,
    bankingWorkflow,
    eventPipelinesWorkflow,
    ecommerceWorkflow,
    queryTuningWorkflow,
] as const satisfies readonly Workflow[];
