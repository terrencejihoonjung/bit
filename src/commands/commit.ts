import { existsSync } from "fs";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import { readIndex } from "../core/index.js";
import { updateHead, getCurrentHead } from "../core/head.js";
import { getIndexPath } from "../utils/fileSystem.js";
import { createTreeFromIndex } from "../core/object.js";

/**
 * Main commit function that:
 * 1. Reads the current index file
 * 2. Creates a tree object from the index entries
 * 3. Gets the parent commit hash (if exists)
 * 4. Creates and writes the commit object
 * 5. Updates HEAD to point to the new commit
 */
async function commit(message: string = "Commit changes") {
  // Read the current index into a Map<string, string>
  const indexPath = getIndexPath();
  const index = await readIndex(indexPath);

  // Create tree object from index entries
  const treeObject = await createTreeFromIndex(index);

  // Write tree object and get its hash
  // Get parent commit hash from HEAD (if exists)
  // Create commit object with:
  // - tree hash
  // - parent hash
  // - author
  // - timestamp
  // - commit message
  // TODO: Convert commit object to string format
  // TODO: Write commit object to get its hash
  // TODO: Update HEAD with new commit hash
  // TODO: Return the commit hash
}

export default commit;
