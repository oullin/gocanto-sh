import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const sourceRoot = join(root, "workspace");
const sourceExtensions = new Set([".ts", ".vue"]);
const relativeImportPattern =
    /(?:^\s*import\s+["']\.{1,2}\/|from\s+["']\.{1,2}\/|export\s+[^;\n]*?\s+from\s+["']\.{1,2}\/|import\s*\(\s*["']\.{1,2}\/)/mu;
const failures = [];

const extensionFor = (file) => {
    const index = file.lastIndexOf(".");

    return index === -1 ? "" : file.slice(index);
};

const visit = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (["node_modules", "dist", ".vite"].includes(entry.name)) {
            continue;
        }

        const file = join(dir, entry.name);

        if (entry.isDirectory()) {
            visit(file);

            continue;
        }

        if (!sourceExtensions.has(extensionFor(entry.name))) {
            continue;
        }

        const source = readFileSync(file, "utf8");

        if (relativeImportPattern.test(source)) {
            failures.push(relative(root, file));
        }
    }
};

visit(sourceRoot);

if (failures.length > 0) {
    console.error("Relative TS/Vue imports are not allowed:");

    for (const failure of failures) {
        console.error(`- ${failure}`);
    }

    process.exit(1);
}
