import path from "path";
import fs from "fs/promises";
import {
  DirectoryGroup,
  DirectoryGroupWithDepth,
  FileEntry,
} from "../entities";

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
export async function createTreeFromIndex(index: Map<string, string>) {
  // Create array to hold tree entries
  const indexEntries = index.entries();

  // Group files by directory using path.dirname()
  const dirGroups = createDirectoryGroups(indexEntries);

  // Sort dirGroups by depth (so that we can work bottom up)
  const sortedDirGroups = sortDirectoriesByDepth(dirGroups);

  console.log(sortedDirGroups);

  // For each directory:
  // - If dir === '.', add files directly as blobs
  // - Else, create subtree and add it to parent tree
}

function createDirectoryGroups(
  indexEntries: MapIterator<[string, string]>
): DirectoryGroup {
  const dirGroups: DirectoryGroup = {};

  for (const [filePath, hash] of indexEntries) {
    const directory = path.dirname(filePath);
    const fileName = path.basename(filePath);

    if (!dirGroups[directory]) {
      dirGroups[directory] = [];
    }

    dirGroups[directory].push({
      name: fileName,
      hash: hash,
    });
  }

  return dirGroups;
}

function sortDirectoriesByDepth(
  dirGroups: DirectoryGroup
): DirectoryGroupWithDepth {
  const dirLevels: DirectoryGroupWithDepth = [];

  // Convert directory groups into DirectoryLevel objects
  for (const [dirPath, files] of Object.entries(dirGroups)) {
    const depth = dirPath === "." ? 0 : dirPath.split("/").length;

    dirLevels.push({
      depth,
      path: dirPath,
      files: files,
    });
  }

  // Sort by depth in descending order (deepest first)
  return dirLevels.sort((a, b) => b.depth - a.depth);
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
