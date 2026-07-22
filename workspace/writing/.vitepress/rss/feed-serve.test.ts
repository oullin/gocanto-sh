import type { IncomingMessage, ServerResponse } from "node:http";

import { describe, expect, it, vi } from "vitest";

import type { Post } from "#writing/posts";
import { RssFeed } from "#writing/rss";

interface RequestStub {
    url: string;
    method: string;
}

interface ResponseStub {
    statusCode: number;
    setHeader: ReturnType<typeof vi.fn>;
    end: ReturnType<typeof vi.fn>;
}

const post: Post = {
    title: "A post",
    url: "/a-post",
    canonicalUrl: "https://writing.gocanto.sh/a-post",
    date: { raw: "2026-07-18", display: "Jul 18, 2026", short: "Jul 18", year: "2026" },
    modifiedAt: "2026-07-18",
    image: "https://writing.gocanto.sh/og-image.png",
    readingTime: "1 min",
    description: "A post description.",
    tags: [],
};

function makeFeed(): RssFeed {
    return new RssFeed({ loadPosts: () => Promise.resolve([post]) });
}

function makeRequest(url: string, method: string): RequestStub {
    return { url, method };
}

function makeResponse(): ResponseStub {
    return { statusCode: 0, setHeader: vi.fn(), end: vi.fn() };
}

// SAFETY: These stubs only exercise the request/response members
// `RssFeed.serve` actually reads or calls (`url`, `method`, `statusCode`,
// `setHeader`, `end`). Node's real IncomingMessage/ServerResponse carry many
// unrelated stream/socket members that this routing test never touches.
function asRequest(stub: RequestStub): IncomingMessage {
    return stub as unknown as IncomingMessage;
}

function asResponse(stub: ResponseStub): ServerResponse {
    return stub as unknown as ServerResponse;
}

describe("RssFeed.serve", () => {
    it("resolves false for a non-matching path without touching the response", async () => {
        const response = makeResponse();

        const handled = await makeFeed().serve(
            asRequest(makeRequest("/not-rss", "GET")),
            asResponse(response),
        );

        expect(handled).toBe(false);
        expect(response.setHeader).not.toHaveBeenCalled();
        expect(response.end).not.toHaveBeenCalled();
    });

    it("resolves false for a POST to the RSS path", async () => {
        const response = makeResponse();

        const handled = await makeFeed().serve(
            asRequest(makeRequest(RssFeed.PATH, "POST")),
            asResponse(response),
        );

        expect(handled).toBe(false);
        expect(response.setHeader).not.toHaveBeenCalled();
        expect(response.end).not.toHaveBeenCalled();
    });

    it("serves the feed on GET with a 200 status and the RSS content type", async () => {
        const response = makeResponse();

        const handled = await makeFeed().serve(
            asRequest(makeRequest(RssFeed.PATH, "GET")),
            asResponse(response),
        );

        expect(handled).toBe(true);
        expect(response.statusCode).toBe(200);
        expect(response.setHeader).toHaveBeenCalledWith("Content-Type", RssFeed.CONTENT_TYPE);
        expect(response.setHeader).toHaveBeenCalledWith("Cache-Control", "no-cache");
        expect(response.end).toHaveBeenCalledTimes(1);
        expect(response.end).toHaveBeenCalledWith(expect.stringContaining("<rss"));
    });

    it("ends the response with no body on HEAD", async () => {
        const response = makeResponse();

        const handled = await makeFeed().serve(
            asRequest(makeRequest(RssFeed.PATH, "HEAD")),
            asResponse(response),
        );

        expect(handled).toBe(true);
        expect(response.statusCode).toBe(200);
        expect(response.end).toHaveBeenCalledWith(undefined);
    });
});
