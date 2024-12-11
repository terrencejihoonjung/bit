import fs from "fs/promises";
import path from "path";
import {
  getBitPath,
  getHeadPath,
  getRefHeadsPath,
} from "../utils/fileSystem.js";
import { existsSync } from "fs";

// Initialze HEAD file
export async function initializeHEAD(
  rootPath: string,
  defaultBranch: string = "main"
) {
  try {
    const content = `ref: refs/heads/${defaultBranch}`;
    const headPath = path.join(rootPath, "HEAD");
    await fs.writeFile(headPath, content);
  } catch (error) {
    console.error(`Error writing initial HEAD: ${error}`);
  }
}

// Update HEAD's branch reference
export async function updateHEAD(branchName: string) {
  const headPath = getHeadPath();
  await fs.writeFile(headPath, `refs: refs/heads/${branchName}`);
}

// List all branch names in refs/heads
export async function listBranches(): Promise<string[]> {
  const headsPath = getRefHeadsPath();
  const dirs = await fs.readdir(headsPath, "utf-8");
  return dirs;
}

// Given branch name, return the commit hash corresponding to that branch
export async function getHead(branchName: string) {
  const bitPath = getBitPath();
  const headsPath = path.join(bitPath, "refs", "heads");
  const branchPath = path.join(headsPath, branchName);

  if (!existsSync(branchPath)) {
    throw new Error("Could not find branch to switch to");
  }

  const commitHash = await fs.readFile(branchPath, "utf-8");
  return { name: branchName, hash: commitHash };
}

// Gets the path of the refs/head file referenced by HEAD
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
  } catch (error) {
    console.error(`Error reading current HEAD: ${error}`);
    return null;
  }
}

// Get commit hash of refs/head referenced by HEAD
export async function getCurrentHeadHash() {
  const fullHeadPath = await getCurrentHeadPath();
  if (!fullHeadPath || !existsSync(fullHeadPath)) return null;

  const hash = await fs.readFile(fullHeadPath, "utf-8");

  // Check if there is no hash
  if (!hash) {
    console.warn("HEAD is empty.");
    return null;
  }

  // Return HEAD commit hash
  return hash;
}

// Updates commit hash value of branch referred to by HEAD
export async function updateCurrentHeadHash(commitHash: string) {
  try {
    // Get HEAD path
    const fullHeadPath = await getCurrentHeadPath();
    if (!fullHeadPath) {
      console.error("Could not find current head");
      return;
    }

    await fs.writeFile(fullHeadPath, commitHash);
  } catch (error) {
    console.error(`Error updating HEAD: ${error}`);
  }
}
