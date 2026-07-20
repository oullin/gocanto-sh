import type { IncomingMessage, ServerResponse } from "node:http";
import { fileURLToPath } from "node:url";

import { beforeAll, describe, expect, it, vi } from "vitest";

import { RSS_CONTENT_TYPE, RSS_PATH, serveRssRequest } from "../rss";

declare global {
    // `var` is required by TypeScript's ambient global-variable syntax.
    var VITEPRESS_CONFIG:
        | {
              srcDir: string;
              site: { base: string };
              cleanUrls: boolean;
          }
        | undefined;
}

// `serveRssRequest` calls `loadRssFeed()` for matching requests, which
// dynamically imports `posts.data.ts`. That module's default export calls
// VitePress's `createContentLoader` at evaluation time, and it throws unless
// `global.VITEPRESS_CONFIG` has already been set by an active VitePress
// process. There is no seam in `rss.ts` (out of scope for this plan) to
// inject a fake loader, so we seed the minimal real config the framework
// needs and let it load the actual posts/ content — real framework state,
// not a module mock.
beforeAll(() => {
    globalThis.VITEPRESS_CONFIG = {
        srcDir: fileURLToPath(new URL("../..", import.meta.url)),
        site: { base: "/" },
        cleanUrls: true,
    };
});

interface RequestStub {
    url: string;
    method: string;
}

interface ResponseStub {
    statusCode: number;
    setHeader: ReturnType<typeof vi.fn>;
    end: ReturnType<typeof vi.fn>;
}

function makeRequest(url: string, method: string): RequestStub {
    return { url, method };
}

function makeResponse(): ResponseStub {
    return { statusCode: 0, setHeader: vi.fn(), end: vi.fn() };
}

// SAFETY: These stubs only exercise the request/response members
// `serveRssRequest` actually reads or calls (`url`, `method`, `statusCode`,
// `setHeader`, `end`). Node's real IncomingMessage/ServerResponse carry many
// unrelated stream/socket members that this routing test never touches.
function asRequest(stub: RequestStub): IncomingMessage {
    return stub as unknown as IncomingMessage;
}

function asResponse(stub: ResponseStub): ServerResponse {
    return stub as unknown as ServerResponse;
}

describe("serveRssRequest", () => {
    it("resolves false for a non-matching path without touching the response", async () => {
        const response = makeResponse();

        const handled = await serveRssRequest(asRequest(makeRequest("/not-rss", "GET")), asResponse(response));

        expect(handled).toBe(false);
        expect(response.setHeader).not.toHaveBeenCalled();
        expect(response.end).not.toHaveBeenCalled();
    });

    it("resolves false for a POST to the RSS path", async () => {
        const response = makeResponse();

        const handled = await serveRssRequest(asRequest(makeRequest(RSS_PATH, "POST")), asResponse(response));

        expect(handled).toBe(false);
        expect(response.setHeader).not.toHaveBeenCalled();
        expect(response.end).not.toHaveBeenCalled();
    });

    it("serves the feed on GET with a 200 status and the RSS content type", async () => {
        const response = makeResponse();

        const handled = await serveRssRequest(asRequest(makeRequest(RSS_PATH, "GET")), asResponse(response));

        expect(handled).toBe(true);
        expect(response.statusCode).toBe(200);
        expect(response.setHeader).toHaveBeenCalledWith("Content-Type", RSS_CONTENT_TYPE);
        expect(response.setHeader).toHaveBeenCalledWith("Cache-Control", "no-cache");
        expect(response.end).toHaveBeenCalledTimes(1);
        expect(response.end.mock.calls[0]?.[0]).toEqual(expect.stringContaining("<rss"));
    });

    it("ends the response with no body on HEAD", async () => {
        const response = makeResponse();

        const handled = await serveRssRequest(asRequest(makeRequest(RSS_PATH, "HEAD")), asResponse(response));

        expect(handled).toBe(true);
        expect(response.statusCode).toBe(200);
        expect(response.end).toHaveBeenCalledWith(undefined);
    });
});
