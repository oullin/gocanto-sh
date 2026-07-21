/** Workflow types exposed by the feature. */
export type {
    ProofAvatar,
    Workflow,
    WorkflowConnector,
    WorkflowDelay,
    WorkflowDetail,
    WorkflowId,
    WorkflowMetadata,
    WorkflowPanelState,
    WorkflowPayload,
    WorkflowPayloadLoader,
    WorkflowPayloadLoaders,
    WorkflowPosition,
    WorkflowStep,
} from "#app/features/workflow-hero/types";

/** Curated workflow data displayed by the hero. */
export {
    defaultWorkflow,
    workflowMetadata,
    workflowPayloadLoaders,
} from "#app/features/workflow-hero/data";

/** Testimonial-proof state for the hero introduction. */
export { useTestimonialProof } from "#app/features/workflow-hero/useTestimonialProof";

/** Interactive tab state and keyboard navigation for workflow selection. */
export { useWorkflowTabs } from "#app/features/workflow-hero/useWorkflowTabs";
