import { describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { AVATAR_BASE_URL } from "@gocanto/domain";
import { useTestimonialProof } from "#app/features/workflow-hero/useTestimonialProof";

vi.mock("@gocanto/store/recommendations", () => {
    return {
        recommendations: {
            data: [
                {
                    uuid: "1",
                    created_at: "2024-01-05",
                    text: "Great work!",
                    person: { full_name: "Alice", avatar: "/alice.jpg" }
                },
                {
                    uuid: "2",
                    created_at: "2024-01-04",
                    text: "Awesome!",
                    person: { full_name: "Bob", avatar: "/bob.jpg" }
                },
                {
                    uuid: "1", // Duplicate
                    created_at: "2024-01-05",
                    text: "Great work!",
                    person: { full_name: "Alice", avatar: "/alice.jpg" }
                },
                {
                    uuid: "3",
                    created_at: "2024-01-06",
                    text: "Fantastic!",
                    person: { full_name: "Charlie", avatar: "/charlie.jpg" }
                },
                {
                    uuid: "4",
                    created_at: "2024-01-02",
                    text: "Nice job!",
                    person: { full_name: "Dave", avatar: "/dave.jpg" }
                },
                {
                    uuid: "5",
                    created_at: "2024-01-01",
                    text: "Superb!",
                    person: { full_name: "Eve", avatar: "/eve.jpg" }
                }
            ]
        }
    };
});

describe("useTestimonialProof", () => {
    it("loads unique recommendations, sorts them by date, and prepares avatars", async () => {
        // useTestimonialProof has an onMounted hook, so we need to mock it within a component
        const Component = {
            template: "<div></div>",
            setup() {
                return useTestimonialProof();
            }
        };

        const wrapper = mount(Component);

        // Before data is loaded
        expect(wrapper.vm.testimonialCount).toBe(0);
        expect(wrapper.vm.proofLoaded).toBe(false);
        expect(wrapper.vm.proofAvatars).toEqual([]);
        expect(wrapper.vm.proofSkeletons).toEqual([0, 1, 2, 3]);

        await flushPromises();

        // 5 unique items: 3, 1, 2, 4, 5 (ordered by date newest first)
        expect(wrapper.vm.testimonialCount).toBe(5);
        expect(wrapper.vm.proofLoaded).toBe(true);

        // Should slice to first 4
        expect(wrapper.vm.proofAvatars).toEqual([
            { src: AVATAR_BASE_URL + "/charlie.jpg", alt: "Charlie" }, // 2024-01-06
            { src: AVATAR_BASE_URL + "/alice.jpg", alt: "Alice" },     // 2024-01-05
            { src: AVATAR_BASE_URL + "/bob.jpg", alt: "Bob" },         // 2024-01-04
            { src: AVATAR_BASE_URL + "/dave.jpg", alt: "Dave" },       // 2024-01-02
        ]);
    });
});
