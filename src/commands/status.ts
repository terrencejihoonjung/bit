import { getCurrentHead } from "../core/head.js";
import { readIndex } from "../core/index.js";
import { readObject } from "../core/object.js";
import { getHeadPath, getIndexPath } from "../utils/fileSystem.js";
import chalk from "chalk";

// Print currently staged files
async function status() {
  // Get index
  const indexPath = getIndexPath();
  const index = await readIndex(indexPath);

  const stagedFiles = Array.from(index.keys());

  printStatus(stagedFiles);
}

// Console output on bit status command
function printStatus(stagedFiles: string[]) {
  console.log("\n");
  console.log(chalk.blue("STAGED FILES"));
  console.log("----------------------------------------------------------");

  for (const stagedFile of stagedFiles) {
    console.log(chalk.green(`${stagedFile}`));
  }

  console.log("----------------------------------------------------------");
  console.log("\n");
}

export default status;
