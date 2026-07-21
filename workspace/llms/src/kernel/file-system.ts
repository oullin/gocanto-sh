/** Provides the filesystem operations required to write generated resources. */
export interface FileSystem {
    /**
     * Ensures that a directory exists.
     *
     * @param path - Directory path to create.
     */
    ensureDir(path: string): void;

    /**
     * Writes a UTF-8 text file.
     *
     * @param path - Destination file path.
     * @param body - Complete file contents.
     */
    writeFile(path: string, body: string): void;
}
