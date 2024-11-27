import { existsSync } from "fs";
import fs from "fs/promises";
import { getIndexPath } from "../utils/fileSystem.js";
export async function readIndex(indexPath) {
    // Check if index exists
    if (!existsSync(indexPath)) {
        return new Map();
    }
    // Read index file
    const contents = await fs.readFile(indexPath, "utf-8");
    // Parse index content into a Map
    const lines = contents.split("\n").filter((line) => line.trim() !== "");
    return new Map(lines.map((line) => {
        const [file, hash] = line.split(" ");
        return [file, hash];
    }));
}
export async function writeIndex(indexPath, index) {
    // Convert index Map to string
    const content = Array.from(index.entries())
        .map(([file, hash]) => `${file} ${hash}`)
        .join("\n");
    // Write string to index file
    await fs.writeFile(indexPath, content);
}
export async function clearIndex() {
    const indexPath = getIndexPath();
    await writeIndex(indexPath, new Map());
}
