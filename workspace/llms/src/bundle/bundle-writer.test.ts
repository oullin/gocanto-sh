import { describe, expect, it } from "vitest";

import { education, experience, links, profile, projects, talks } from "@gocanto/store";
import { recommendations } from "@gocanto/store/recommendations";

import { MarkdownBundleWriter } from "#llms/bundle/bundle-writer";
import type { FileSystem } from "#llms/kernel/file-system";

class MemoryFileSystem implements FileSystem {
    public readonly directories: string[] = [];
    public readonly writes = new Map<string, string>();

    public ensureDir(path: string): void {
        this.directories.push(path);
    }

    public writeFile(path: string, body: string): void {
        this.writes.set(path, body);
    }
}

describe("MarkdownBundleWriter.generate", () => {
    it("writes the complete normalized bundle and returns its summary", () => {
        const fs = new MemoryFileSystem();

        const summary = new MarkdownBundleWriter(fs).generate("/dist", {
            profile,
            projects,
            experience,
            education,
            recommendations,
            talks,
            links,
        });

        const expectedFiles = [
            "profile.md",
            "experience.md",
            "projects.md",
            "education.md",
            "talks.md",
            "recommendations.md",
            "links.md",
            "index.md",
            "llms.txt",
            "sitemap.xml",
        ];

        expect(fs.directories).toEqual(["/dist"]);
        expect(
        	[...fs.writes.keys()],
        ).toEqual(expectedFiles.map((file) => `/dist/${file}`));

        for (const body of fs.writes.values()) {
            expect(
            	body.endsWith("\n"),
            ).toBe(true);
        }

        expect(summary).toEqual({
            files: expectedFiles,
            lastmod: "2026-03-18",
        });
    });
});
