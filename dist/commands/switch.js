import path from "path";
import fs from "fs/promises";
import { getBitPath } from "../utils/fileSystem.js";
import { getCurrentHeadHash, getHead, updateHEAD, } from "../core/head.js";
function getBranchPath(branch) {
    const bitPath = getBitPath();
    const headsPath = path.join(bitPath, "refs", "heads");
    const newBranchPath = path.join(headsPath, branch);
    return newBranchPath;
}
/*
Given a branch name:
- Get the commit hash corresponding to that branch
- Update the HEAD file to contain that commit hash
*/
export async function switchBranch(branch) {
    const { name, hash } = await getHead(branch);
    await updateHEAD(name);
}
export async function createBranch(branch) {
    const branchPath = getBranchPath(branch);
    const latestCommit = await getCurrentHeadHash();
    if (!latestCommit) {
        throw new Error("Error creating branch. There is no existing commit object to base the new branch on.");
    }
    await fs.writeFile(branchPath, latestCommit);
}
