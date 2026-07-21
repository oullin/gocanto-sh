/** Recommendation adapted for testimonial display. */
export type TestimonialItem = {
    readonly id: string;
    readonly name: string;
    readonly text: string;
    readonly avatar: string;
    readonly role: string;
    readonly company: string;
    readonly featured: boolean;
};
