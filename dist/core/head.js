import fs from "fs/promises";
import path from "path";
import { getHeadPath } from "../utils/fileSystem.js";
export async function writeInitialHead(rootPath, defaultBranch = "main") {
    try {
        const content = `ref: refs/heads/${defaultBranch}\n`;
        const headPath = path.join(rootPath, "HEAD");
        await fs.writeFile(headPath, content);
    }
    catch (error) {
        console.error(`Error writing initial HEAD: ${error}`);
    }
}
export async function updateHead(commitHash) {
    try {
        // Write commit hash to HEAD file
        const headPath = getHeadPath();
        await fs.writeFile(headPath, commitHash);
    }
    catch (error) {
        console.error(`Error updating HEAD: ${error}`);
    }
}
export async function getCurrentHead() {
    try {
        const headPath = getHeadPath();
        const head = await fs.readFile(headPath, "utf-8");
        const trimmedHead = head.trim();
        // Check if HEAD is empty
        if (!trimmedHead) {
            console.warn("HEAD is empty.");
            return null;
        }
        // Return HEAD commit hash
        return trimmedHead;
    }
    catch (error) {
        console.error(`Error reading current HEAD: ${error}`);
        return null;
    }
}
