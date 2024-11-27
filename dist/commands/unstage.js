import { readIndex, writeIndex } from "../core/index.js";
import { existsSync } from "fs";
import { getIndexPath } from "../utils/fileSystem.js";
async function unstage(files) {
    const indexPath = getIndexPath();
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
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Failed to unstage file(s):", error.message);
        }
    }
}
export default unstage;
