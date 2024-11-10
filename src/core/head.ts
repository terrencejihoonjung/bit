import fs from "fs/promises";
import path from "path";

export async function writeInitialHead(
  rootPath: string,
  defaultBranch: string = "main"
) {
  const content = `ref: refs/heads/${defaultBranch}\n`;
  await fs.writeFile(path.join(rootPath, "HEAD"), content);
}

export async function updateHead(commitHash: string) {
  // TODO: Write commit hash to HEAD file
}

export async function getCurrentHead() {
  // TODO: Try to read HEAD file
  // TODO: Return null if doesn't exist or is empty
  // TODO: Return commit hash if exists
}
