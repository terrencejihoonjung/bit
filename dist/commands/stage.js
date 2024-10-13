import { existsSync } from "fs";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
async function stage(files) {
    const bitDir = ".bit";
    const indexPath = path.join(bitDir, "index");
    // Check if .bit directory exists
    if (!existsSync(bitDir)) {
        console.error(".bit repository doesn't exist. Please initialize a repository first.");
        return;
    }
    // Check if index exists, create if not
    if (!existsSync(indexPath)) {
        await fs.writeFile(indexPath, "");
    }
    // TODO: Read current index
    const currentIndex = await readIndex(indexPath);
    try {
        for (const file of files) {
            // Check if file exists
            if (existsSync(file)) {
                if ((await fs.stat(file)).isDirectory()) {
                    await stageDirectory(file, currentIndex); // If directory, handle recursively
                }
                else {
                    await stageFile(file, currentIndex); //  If file, stage it
                }
            }
        }
        // Write updated index
        await writeIndex(indexPath, currentIndex);
        console.log("Files staged successfully");
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Failed to stage file(s):", error.message);
        }
    }
}
async function stageFile(file, index) {
    // Read file contents
    const content = await fs.readFile(file);
    // Hash file contents
    const hash = crypto.createHash("sha1").update(content).digest("hex");
    // Add to index
    index.set(file, hash);
    // Write file to object store
    await writeToObjectStore(hash, content);
}
async function stageDirectory(dir, index) {
    // Read directory contents
    const files = await fs.readdir(dir, { withFileTypes: true });
    // Recursively stage files and subdirectories
    for (const file of files) {
        const filePath = path.join(dir, file.name); // Create file path using directory and current file
        if (existsSync(filePath)) {
            if (file.isDirectory()) {
                await stageDirectory(filePath, index);
            }
            else if (file.isFile()) {
                await stageFile(filePath, index);
            }
        }
    }
}
async function readIndex(indexPath) {
    // Read index file
    const contents = await fs.readFile(indexPath, "utf-8");
    // Parse index content into a Map
    const lines = contents.split("\n").filter((line) => line.trim() !== "");
    return new Map(lines.map((line) => {
        const [file, hash] = line.split(" ");
        return [file, hash];
    }));
}
async function writeIndex(indexPath, index) {
    // Convert index Map to string
    const content = Array.from(index.entries())
        .map(([file, hash]) => `${file} ${hash}`)
        .join("\n");
    // Write string to index file
    await fs.writeFile(indexPath, content);
}
async function writeToObjectStore(hash, content) {
    // Determine object path
    const objectDir = path.join(".bit", "objects");
    const objectPath = path.join(objectDir, hash.slice(0, 2), hash.slice(2));
    // Create directory and write contents to file
    await fs.mkdir(path.dirname(objectPath), { recursive: true });
    await fs.writeFile(objectPath, content);
}
export default stage;
