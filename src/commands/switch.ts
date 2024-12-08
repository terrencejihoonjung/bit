import path from "path";
import fs from "fs/promises";
import { getBitPath } from "../utils/fileSystem.js";
import {
  getCurrentHeadHash,
  getHead,
  updateCurrentHead,
} from "../core/head.js";

function getBranchPath(branch: string) {
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
export async function switchBranch(branch: string) {
  const { name, hash } = await getHead(branch);
  await updateCurrentHead(name);
}

export async function createBranch(branch: string) {
  const branchPath = getBranchPath(branch);
  const latestCommit = await getCurrentHeadHash();

  if (!latestCommit) {
    throw new Error(
      "Error creating branch. There is no existing commit object to base the new branch on."
    );
  }
  await fs.writeFile(branchPath, latestCommit);
}
