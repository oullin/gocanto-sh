import { describe, expect, it } from "vitest";

import { defaultWorkflow, workflowMetadata } from "#app/features/workflow-hero/data";

describe("workflow metadata", () => {
    it("lists six lightweight tab entries", () => {
        expect(workflowMetadata).toHaveLength(6);
        expect(
            workflowMetadata.map((workflow) => workflow.label),
        ).toEqual([
            "AI Platform",
            "Fintech Payments",
            "Banking",
            "Event Pipelines",
            "Ecommerce",
            "Query Tuning",
        ]);

        for (const workflow of workflowMetadata) {
            expect(
                Object.keys(workflow).sort(),
            ).toEqual(["icon", "id", "label"]);
        }
    });

    it("keeps the default workflow payload available synchronously", () => {
        expect(defaultWorkflow.id).toBe(workflowMetadata[0].id);
        expect(defaultWorkflow.steps[0]?.title).toBe("Ollin Agent Go");
        expect(defaultWorkflow.connectors.length).toBeGreaterThan(0);
    });
});
