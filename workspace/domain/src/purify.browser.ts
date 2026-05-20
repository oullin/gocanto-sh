import createDOMPurify from "dompurify";

export const purify = createDOMPurify(window);

const decodeContainer = document.createElement("textarea");

export const decodeHtmlEntities = (input: string): string => {
    decodeContainer.innerHTML = input;

    return decodeContainer.value;
};
