import path from "path";
import { readIndex, writeIndex } from "../core/index.js";
import { existsSync } from "fs";
import fs from "fs/promises";

async function unstage(files: string[]) {
  const bitDir = ".bit";
  const indexPath = path.join(bitDir, "index");

  // Check if .bit directory exists
  if (!existsSync(bitDir)) {
    console.error(
      ".bit repository doesn't exist. Please initialize a repository first."
    );
    return;
  }

  // Check if index exists, create if not
  if (!existsSync(indexPath)) {
    await fs.writeFile(indexPath, "");
  }

  // Read index
  const index = await readIndex(indexPath);

  try {
    // Remove files from index that are included in the files input
    for (const file of files) {
      if (index.has(file) && existsSync(file)) {
        index.delete(file);
      }
    }

    // Write updated index
    await writeIndex(indexPath, index);

    console.log("Files unstaged successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to unstage file(s):", error.message);
    }
  }
}

export default unstage;
