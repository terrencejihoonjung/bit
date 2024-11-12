import fs from "fs/promises";
import path from "path";
import { getHeadPath } from "../utils/fileSystem.js";
import { existsSync } from "fs";

export async function writeInitialHead(
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

export async function updateHead(commitHash: string) {
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

export async function getCurrentHead() {
  const fullHeadPath = await getCurrentHeadPath();
  if (!fullHeadPath) return null;

  if (!existsSync(fullHeadPath)) return null;
  const hash = await fs.readFile(fullHeadPath, "utf-8");

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
  } catch (error) {
    console.error(`Error reading current HEAD: ${error}`);
    return null;
  }
}
