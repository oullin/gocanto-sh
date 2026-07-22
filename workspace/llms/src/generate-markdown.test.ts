import { bio, education, experience, links, profile, projects, talks } from "@gocanto/store";
import { recommendations } from "@gocanto/store/recommendations";
import { describe, it, expect, vi, beforeEach } from "vitest";

const generateMock = vi.fn().mockReturnValue({
    files: ["test.md", "other.md", "llms.txt"],
    lastmod: "2023-01-01",
});

vi.mock("#llms/bundle/bundle-writer", () => {
    return {
        MarkdownBundleWriter: vi.fn().mockImplementation(function () {
            return {
                generate: generateMock,
            };
        }),
    };
});

vi.mock("#llms/kernel/node-file-system", () => {
    return {
        NodeFileSystem: vi.fn(),
    };
});

describe("generate-markdown", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });

    it("should generate markdown files into the app dist directory", async () => {
        await import("./generate-markdown");

        expect(generateMock).toHaveBeenCalled();

        const callArgs = generateMock.mock.calls[0];

        // Assert on the distDir path. Note: __dirname in tests might differ from the actual module.
        // It's safer to just check it ends with the right path segment.
        expect(callArgs[0]).toMatch(/app\/dist$/);

        expect(callArgs[1]).toEqual({
            profile,
            bio,
            projects,
            experience,
            education,
            recommendations,
            talks,
            links,
        });
    });
});
