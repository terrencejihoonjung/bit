import path from "path";
import { clearIndex, readIndex } from "../core/index.js";
import { updateHead, getCurrentHead } from "../core/head.js";
import { getIndexPath } from "../utils/fileSystem.js";
import { createAndHashTreeFromIndex, writeObject } from "../core/object.js";
import { CommitObject } from "../entities.js";
import { readConfig } from "../utils/config.js";
import { hashContent } from "../utils/hash.js";

/**
Main commit function that:
  1. Reads the current index file
  2. Creates a tree object from the index entries
  3. Gets the parent commit hash (if exists)
  4. Creates and writes the commit object
  5. Updates HEAD to point to the new commit
 */
async function commit(message: string = "Commit changes") {
  // Read the current index into a Map<string, string>
  const indexPath = getIndexPath();
  const index = await readIndex(indexPath);

  // Create and hash tree object from index entries
  const treeHash = await createAndHashTreeFromIndex(index);

  // Get parent commit hash from HEAD (if exists)
  const parentCommit = await getCurrentHead();

  // Create commit object
  const configInfo = await readConfig(path.join(".bit", "config"));
  const commitObject: CommitObject = {
    treeHash: treeHash,
    parent: parentCommit,
    author: configInfo.name,
    timestamp: new Date().toISOString(),
    message: message,
  };

  // Hash commit object and write it to object store
  const serializedCommitObject = Buffer.from(JSON.stringify(commitObject));
  const commitHash = hashContent(serializedCommitObject);
  await writeObject(commitHash, serializedCommitObject);

  // Update HEAD with new commit hash
  await updateHead(commitHash);

  // Clear index
  await clearIndex();

  // Return the commit hash
  console.log(`Successfully created commit: ${commitHash}`);
}

export default commit;
