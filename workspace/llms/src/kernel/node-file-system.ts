import { mkdirSync, writeFileSync } from "node:fs";

import type { FileSystem } from "#llms/kernel/file-system";

/** Adapts synchronous Node.js filesystem operations for bundle generation. */
export class NodeFileSystem implements FileSystem {
    /**
     * Ensures that a directory and any missing parents exist.
     *
     * @param path - Directory path to create.
     */
    public ensureDir(path: string): void {
        mkdirSync(path, { recursive: true });
    }

    /**
     * Writes a complete UTF-8 text file.
     *
     * @param path - Destination file path.
     * @param body - Complete file contents.
     */
    public writeFile(path: string, body: string): void {
        writeFileSync(path, body, "utf8");
    }
}
