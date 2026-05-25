import type { RecommendationRecord } from "../types";

export const silverlakeRecommendations = [
    {
        uuid: "1f58646c-ba87-4306-905f-cb64a5e49b5e",
        relation: "Shaun Chan reported to Gus directly.",
        text: "I had the pleasure of working with Gus, and it was an absolute joy. He’s an incredibly technical and knowledgeable developer with a natural ability to make complex topics approachable. Gus consistently maintains high standards in his work and always delivers projects on time.<br/><br/>What really sets him apart is his eagerness to learn new technologies and his generosity in sharing that knowledge with others. He’s been an amazing mentor and a true team player. Any team would be lucky to have someone as dedicated, skilled, and collaborative as Gus.",
        person: {
            avatar: "recommendation/shaun-chan.jpeg",
            full_name: "Shaun Chan",
            company: "Silverlake",
            designation: "Software Engineer",
        },
        created_at: "2025-11-07",
        updated_at: "2025-11-07",
        featured: 0,
    },
    {
        uuid: "ae960c59-4715-49d5-8a67-0b2464b79c26",
        relation: "Wan Ting reported to Gus directly.",
        text: "Gust is a highly skilled full-stack developer, technical lead, and architect with deep expertise in building scalable, secure solutions—critical in the fast-paced fintech landscape. Beyond his technical acumen, Gust is a generous mentor who actively shares knowledge, identifies blind spots, and encourages continuous learning.<br/><br/>His guidance helped our team navigate complex challenges and sharpen our strategic thinking, both in product development and career growth.<br/><br/>I'm grateful to have had such a thoughtful and visionary leader on our team.",
        person: {
            avatar: "recommendation/wan-ting.jpeg",
            full_name: "Wan Ting",
            company: "Silverlake",
            designation: "Software Engineer",
        },
        created_at: "2025-11-06",
        updated_at: "2025-11-06",
        featured: 0,
    },
    {
        uuid: "d73e4610-a636-41e4-974f-a294abdd1a72",
        relation: "Hooi Yang reported to Gus directly.",
        text: "I’m extremely lucky to be able to work with Gus. He’s a friendly, approachable person who’s genuinely easy to be around, while also being an elite professional who knows his craft inside and out. At work he strives for excellence in everything he does and communicates with clarity and purpose.<br/><br/>Eager to stay the top of the game, Gus is always learning and exploring new technologies. More importantly, he shares his valuable knowledge and experience with me. As a natural leader, he inspires those around him to be self-improve and be better. I've learnt a lot from him and highly recommend him.",
        person: {
            avatar: "recommendation/felix-silverlake.jpeg",
            full_name: "Hooi Yang Choo",
            company: "Silverlake",
            designation: "Software Engineer",
        },
        created_at: "2025-11-04",
        updated_at: "2025-11-04",
        featured: 0,
    },
] as const satisfies readonly RecommendationRecord[];
