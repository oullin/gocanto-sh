import { aspireRecommendations } from "./aspire";
import { otherRecommendations } from "./other";
import { perxRecommendations } from "./perx";
import { silverlakeRecommendations } from "./silverlake";

import type { RecommendationRecord } from "../types";

const recommendationOrder = [
    "1f58646c-ba87-4306-905f-cb64a5e49b5e",
    "ae960c59-4715-49d5-8a67-0b2464b79c26",
    "d73e4610-a636-41e4-974f-a294abdd1a72",
    "be1f8226-61d8-4b9b-a30f-0cdb521bd841",
    "0fa21471-c13a-4c8a-83ba-9b5d8782ab72",
    "4375e073-9098-4f5f-9f8b-44ca47667f0b",
    "7dc74d20-42e1-4f09-9c8d-20ecfc6caad7",
    "68d753fa-e523-4c68-a3f3-944bfee52e44",
    "2eed9ce3-2c48-4b06-9dfc-9fc3a2c75f01",
    "fcf927e0-e8ab-4c4b-adfa-65ecfcf902de",
    "86fa5273-4e21-45e0-80de-5ec908cf6f81",
    "dec7e524-34cc-405c-9b3a-01999852c9bb",
    "e4626228-99fa-4778-9a22-783174e7ab60",
    "fa5c4084-e1b4-45dd-a314-e8d9f589f67e",
    "8bc18bf9-0983-4c7e-8095-b3d1e642fee4",
    "b282a643-b283-41be-82ee-5a3eda853e69",
    "0e587fa2-b678-4ca5-9eed-0f115c4a092d",
    "4b4d927a-ad7b-4f00-9140-d5b27f99fdc9",
    "a5029b3e-3ad2-45a4-8e98-2599cdf21697",
    "e4a9fd59-5ecf-467f-934a-798100478700",
    "6fa9fce8-f3a4-40ce-b87a-60134da50007",
    "1ca2026d-9d52-4da9-bbe2-5adba175d4c4",
    "99d55cbb-11a4-4fd2-9d5a-1530ef9cb0bb",
    "baf49d10-1700-4881-9268-5076e80f42f5",
    "3fb5dfaa-a7b7-411c-8d2e-80b75fcd45df",
    "045ff8fc-12af-47c7-a761-6c2a0995d352",
    "4784b603-583d-4159-ab6b-7e7bddb4b3e5",
    "1991f645-d50a-4975-8ba6-90cf18ae3a90",
    "186c98c0-9df5-42c2-bccd-3724e4f50917",
    "9410aaec-c4fe-4078-ae84-ab2d2dee19d9",
    "d7839355-c7af-4962-bcbd-e7f41a75199c",
    "0f6dae3e-ec78-43a9-b9ff-322642f88594",
    "387a95d6-d29b-4faf-aa60-3b071c59cd22",
    "8e05af84-3054-404f-89f2-428ae69943ef",
    "4faf4435-93d4-48ef-b980-4b94d353f2f7",
    "50fcd53c-2135-4c94-8fb2-30f111b3218e",
    "b5b4cff9-156e-4296-974e-0c4f0437e31d",
] as const;
const recommendationsByUuid = new Map(
    [
        ...silverlakeRecommendations,
        ...perxRecommendations,
        ...aspireRecommendations,
        ...otherRecommendations,
    ].map((recommendation) => [recommendation.uuid, recommendation]),
);

export const recommendationItems = recommendationOrder.map((uuid) => {
    const recommendation = recommendationsByUuid.get(uuid);

    if (!recommendation) {
        throw new Error(`Missing recommendation fixture: ${uuid}`);
    }

    return recommendation;
}) satisfies readonly RecommendationRecord[];
