import path from "path";
import fs from "fs/promises";
import { hashContent } from "../utils/hash.js";
// READ/WRITE OBJECTS
export async function readObject(hash) {
    // Determine object path
    const objectDir = path.join(".bit", "objects");
    const objectPath = path.join(objectDir, hash.slice(0, 2), hash.slice(2));
    const contents = await fs.readFile(objectPath, "utf-8");
    return JSON.parse(contents);
}
export async function writeObject(hash, content) {
    // Determine object path
    const objectDir = path.join(".bit", "objects");
    const objectPath = path.join(objectDir, hash.slice(0, 2), hash.slice(2));
    // Create directory and write contents to file
    await fs.mkdir(path.dirname(objectPath), { recursive: true });
    await fs.writeFile(objectPath, content);
    return hash;
}
// TREE OBJECTS
export async function createAndHashTreeFromIndex(index) {
    // Create array to hold tree entries
    const indexEntries = index.entries();
    // Group files by directory using path.dirname()
    const dirGroups = createDirectoryGroups(indexEntries);
    // Sort dirGroups by depth (so that we can work bottom up)
    const sortedDirGroups = sortDirectoriesByDepth(dirGroups);
    // Create, hash, and write tree object
    const treeHash = await createAndHashTreeFromSortedDirGroups(sortedDirGroups);
    return treeHash;
}
function createDirectoryGroups(indexEntries) {
    const dirGroups = {};
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
function sortDirectoriesByDepth(dirGroups) {
    const dirLevels = [];
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
async function createAndHashTreeFromSortedDirGroups(sortedDirGroups) {
    // Keep track of all tree object hashes being created (maps directory to tree object hash)
    const treeHashes = new Map();
    // Process each dirGroup, starting from the deepest level
    for (const dirGroup of sortedDirGroups) {
        const treeEntries = [];
        // Add blob entries (files)
        for (const file of dirGroup.files) {
            treeEntries.push({
                type: "blob",
                hash: file.hash,
                name: file.name,
            });
        }
        // Add tree entries (subdirectories)
        for (const [dirPath, hash] of treeHashes) {
            const parentDir = path.dirname(dirPath);
            if (dirGroup.path === parentDir) {
                treeEntries.push({
                    type: "tree",
                    hash: hash,
                    name: path.basename(dirPath),
                });
            }
        }
        // Sort tree entries alphabetically
        treeEntries.sort((a, b) => a.name.localeCompare(b.name));
        // Create tree object
        const treeObject = { entries: treeEntries };
        // Seralize and hash tree object
        const serializedTreeObject = serializeTreeObject(treeObject);
        const treeHash = hashContent(serializedTreeObject);
        // Write tree object to object store
        await writeObject(treeHash, serializedTreeObject);
        // Store tree object hash to treeHashes
        treeHashes.set(dirGroup.path, treeHash);
    }
    // Return the root tree object hash (last item in treeHashes)
    const rootPath = sortedDirGroups[sortedDirGroups.length - 1].path;
    return treeHashes.get(rootPath);
}
function serializeTreeObject(treeObject) {
    // Serialize each entry
    const serializedEntries = treeObject.entries
        .map((entry) => {
        return `${entry.type} ${entry.hash} ${entry.name}`;
    })
        .join("\n");
    return Buffer.from(`tree\n${serializedEntries}`);
}
// COMMIT OBJECTS
