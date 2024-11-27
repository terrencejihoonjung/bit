import { readIndex } from "../core/index.js";
import { getIndexPath } from "../utils/fileSystem.js";
import chalk from "chalk";

// Go through entire project and organize based on whether the file is in the index or not.
async function status() {
  const indexPath = getIndexPath();
  const index = await readIndex(indexPath);

  const stagedFiles = Array.from(index.keys());

  printStatus(stagedFiles);
}

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
