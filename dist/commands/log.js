import chalk from "chalk";
import { getCurrentHead } from "../core/head.js";
import { readObject } from "../core/object.js";
async function log() {
    // Check current head and get last commit object
    const currentHeadHash = await getCurrentHead();
    if (!currentHeadHash) {
        throw new Error("Failed to get current head hash");
    }
    let parsedHead = await readObject(currentHeadHash);
    if (!parsedHead) {
        console.log("The current branch's commit history is empty.");
        return;
    }
    // Print commit objects for each commit object in the parent-child chain
    const commitObjects = [];
    while (parsedHead) {
        commitObjects.push(parsedHead);
        if (!parsedHead.parent)
            break;
        parsedHead = await readObject(parsedHead.parent);
    }
    printCommit(commitObjects);
}
function printCommit(commitObjects) {
    for (const commitObject of commitObjects) {
        console.log("----------------------------------------------------------");
        console.log("\n");
        console.log(chalk.green(`Commit: ${commitObject.treeHash} by ${commitObject.author}`));
        console.log(chalk.yellow(`Message: ${commitObject.message} written at ${commitObject.timestamp}`));
        console.log("\n");
    }
}
export default log;