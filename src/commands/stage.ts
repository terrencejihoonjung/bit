import { existsSync } from "fs";
import path from "path";
import fs from "fs/promises";
import { hashContent } from "../utils/hash.js";
import { writeObject } from "../core/object.js";
import { readIndex, writeIndex } from "../core/index.js";
import { getBitIgnorePath } from "../utils/fileSystem.js";

async function stage(files: string[]) {
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

  // Read current index
  const currentIndex = await readIndex(indexPath);

  const bitIgnorePath = getBitIgnorePath();
  const bitIgnoreContents = bitIgnorePath
    ? await fs.readFile(bitIgnorePath, "utf-8")
    : "";
  const bitIgnore = new Set(
    bitIgnoreContents.split("\n").filter((path) => path.trim().length > 0)
  );

  try {
    let filesStaged = false;
    for (const file of files) {
      if (bitIgnore.has(file)) continue;

      // Check if file exists
      if (existsSync(file)) {
        if ((await fs.stat(file)).isDirectory()) {
          filesStaged = await stageDirectory(
            file,
            currentIndex,
            filesStaged,
            bitIgnore
          ); // If directory, handle recursively
        } else {
          filesStaged = true;
          await stageFile(file, currentIndex); //  If file, stage it
        }
      }
    }

    // Write updated index
    await writeIndex(indexPath, currentIndex);

    if (filesStaged) console.log("Files staged successfully");
    else console.log("Nothing to stage :(");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to stage file(s):", error.message);
    }
  }
}

async function stageFile(file: string, index: Map<string, string>) {
  // Read file contents
  const content = await fs.readFile(file);

  // Hash file contents
  const hash = hashContent(content);

  // Add to index
  index.set(file, hash);

  // Write file to object store
  await writeObject(hash, content);
}

async function stageDirectory(
  dir: string,
  index: Map<string, string>,
  filesStaged: boolean,
  bitIgnore: Set<string>
) {
  // Read directory contents
  const files = await fs.readdir(dir, { withFileTypes: true });

  // Recursively stage files and subdirectories
  for (const file of files) {
    const filePath = path.join(dir, file.name); // Create file path using directory and current file
    if (bitIgnore.has(filePath)) continue;

    if (existsSync(filePath)) {
      if (file.isDirectory()) {
        await stageDirectory(filePath, index, filesStaged, bitIgnore);
      } else if (file.isFile()) {
        filesStaged = true;
        await stageFile(filePath, index);
      }
    }
  }

  return filesStaged;
}

export default stage;
