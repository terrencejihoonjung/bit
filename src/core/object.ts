import path from "path";
import fs from "fs/promises";

// READ/WRITE OBJECTS
export async function writeObject(hash: string, content: Buffer) {
  // Determine object path
  const objectDir = path.join(".bit", "objects");
  const objectPath = path.join(objectDir, hash.slice(0, 2), hash.slice(2));

  // Create directory and write contents to file
  await fs.mkdir(path.dirname(objectPath), { recursive: true });
  await fs.writeFile(objectPath, content);
  return hash;
}

// TREE OBJECTS
/**
 * Create tree entries from index
 * 1. Group files by directory
 * 2. For root directory files (dir === '.'):
 *    - Add them directly to tree as blobs
 * 3. For subdirectories:
 *    - Create subtree
 *    - Add subtree to parent tree
 */
async function createTreeFromIndex(index: Map<string, string>) {
  // TODO: Create array to hold tree entries
  // TODO: Group files by directory using path.dirname()
  // TODO: For each directory:
  //   - If dir === '.': add files directly as blobs
  //   - Otherwise: create subtree and add it to parent tree
}

// COMMIT OBJECTS
/**
 * Format commit object as string
 * Format:
 * tree <hash>
 * parent <hash>
 * author <name>
 * timestamp <ISO string>
 * message <message>
 */
function formatCommitObject(commit: any) {
  // TODO: Convert commit object to formatted string
}
