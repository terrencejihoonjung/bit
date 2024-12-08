import fs from "fs/promises";
import path from "path";
import { getBitPath, getHeadPath } from "../utils/fileSystem.js";
import { existsSync } from "fs";
export async function initializeHead(rootPath, defaultBranch = "main") {
    try {
        const content = `ref: refs/heads/${defaultBranch}`;
        const headPath = path.join(rootPath, "HEAD");
        await fs.writeFile(headPath, content);
    }
    catch (error) {
        console.error(`Error writing initial HEAD: ${error}`);
    }
}
// Given branch name, return the commit hash corresponding to that branch
export async function getHead(branchName) {
    const bitPath = getBitPath();
    const headsPath = path.join(bitPath, "refs", "heads");
    const branchPath = path.join(headsPath, branchName);
    if (!existsSync(branchPath)) {
        throw new Error("Could not find branch to switch to");
    }
    const commitHash = await fs.readFile(branchPath, "utf-8");
    return { name: branchName, hash: commitHash };
}
export async function updateCurrentHeadHash(commitHash) {
    try {
        // Get HEAD path
        const fullHeadPath = await getCurrentHeadPath();
        if (!fullHeadPath) {
            console.error("Could not find current head");
            return;
        }
        await fs.writeFile(fullHeadPath, commitHash);
    }
    catch (error) {
        console.error(`Error updating HEAD: ${error}`);
    }
}
export async function updateCurrentHead(branchName) {
    const headPath = getHeadPath();
    await fs.writeFile(headPath, `refs: refs/heads/${branchName}`);
}
export async function getCurrentHeadHash() {
    const fullHeadPath = await getCurrentHeadPath();
    if (!fullHeadPath)
        return null;
    const pathElements = fullHeadPath.split("/");
    const { name, hash } = await getHead(pathElements[pathElements.length - 1]);
    // Check if there is no hash
    if (!hash) {
        console.warn("HEAD is empty.");
        return null;
    }
    // Return HEAD commit hash
    return hash;
}
export async function getCurrentHeadPath() {
    try {
        const headPath = getHeadPath();
        const head = await fs.readFile(headPath, "utf-8");
        // Check if HEAD is empty
        if (!head.trim()) {
            console.warn("HEAD is empty.");
            return null;
        }
        // Get path of current head under "refs"
        const parsedHead = head.split(": ")[1];
        const fullHeadPath = path.join(".bit", parsedHead);
        return fullHeadPath;
    }
    catch (error) {
        console.error(`Error reading current HEAD: ${error}`);
        return null;
    }
}
