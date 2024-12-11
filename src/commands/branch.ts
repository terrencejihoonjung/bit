import chalk from "chalk";
import { getCurrentHeadPath, listBranches } from "../core/head.js";

async function branch() {
  // Create a set of al branch names in .bit/refs/heads
  const branches = await listBranches();
  const uniqueBranches = new Set<string>(branches);

  // Get the name of the current head's branch name
  const currentHeadPath = await getCurrentHeadPath();
  const currentHeadPathElements = currentHeadPath?.split("/")!;

  const currentHeadName =
    currentHeadPathElements[currentHeadPathElements.length - 1];

  // Print branch output
  printBranches(uniqueBranches, currentHeadName);
}

function printBranches(branches: Set<string>, currentBranch: string) {
  console.log("\n");
  console.log("BRANCHES");
  console.log("----------------------------------------------------------");

  for (const branch of branches) {
    if (branch === currentBranch) console.log(chalk.green(`${branch}`));
    else console.log(chalk.white(`${branch}`));
  }

  console.log("----------------------------------------------------------");
  console.log("\n");
}

export default branch;
