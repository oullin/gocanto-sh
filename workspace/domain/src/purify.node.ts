import createDOMPurify from "dompurify";
import type { WindowLike } from "dompurify";
import { JSDOM } from "jsdom";

const purifyWindow = new JSDOM("").window;

export const purify = createDOMPurify(purifyWindow as unknown as WindowLike);

const decodeContainer = purifyWindow.document.createElement("textarea");

export const decodeHtmlEntities = (input: string): string => {
    decodeContainer.innerHTML = input;

    return decodeContainer.value;
};
