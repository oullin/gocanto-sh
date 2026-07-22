import { mkdirSync, writeFileSync } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { NodeFileSystem } from "#llms/kernel/node-file-system";

vi.mock("node:fs", () => ({
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
}));

describe("NodeFileSystem", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("ensureDir", () => {
        it("creates the directory with recursive option", () => {
            const fs = new NodeFileSystem();
            fs.ensureDir("/test/path");

            expect(mkdirSync).toHaveBeenCalledWith("/test/path", { recursive: true });
            expect(mkdirSync).toHaveBeenCalledTimes(1);
        });
    });

    describe("writeFile", () => {
        it("writes the file with utf8 encoding", () => {
            const fs = new NodeFileSystem();
            fs.writeFile("/test/path/file.txt", "file content");

            expect(writeFileSync).toHaveBeenCalledWith("/test/path/file.txt", "file content", "utf8");
            expect(writeFileSync).toHaveBeenCalledTimes(1);
        });
    });
});
