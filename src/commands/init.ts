import { existsSync } from "fs";
import path from "path";
import os from "os";
import fs from "fs/promises";

async function init() {
  console.log("Initializing bit repository...");

  // Check for existing bit repository
  if (existsSync(".bit")) {
    console.log(".bit directory already exists");
    return;
  }

  const username = os.userInfo().username;

  try {
    // Create new .bit directory
    await fs.mkdir(".bit");
    const rootPath = path.resolve(".bit");

    // Setup paths
    const headsPath = path.join(rootPath, "refs", "heads");

    // Create default branch
    await fs.mkdir(headsPath, { recursive: true });
    await writeInitialHEAD(rootPath);

    // Create config file
    const initialConfig = `[branch]
      default = main
    [user]
      name = ${username}
    `;
    await fs.writeFile(path.join(rootPath, "config"), initialConfig);

    // Create objects directory
    await fs.mkdir(path.join(rootPath, "objects"));

    // User Feedback
    console.log(`Successfully initialized bit repository for ${username}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to initialize bit repository:", error.message);
      try {
        // Delete the entire .bit repository
        await fs.rm(path.resolve(".bit"), { recursive: true });
      } catch (cleanupError) {
        console.error("Failed to clean up partial initialization.");
      }
    }
  }
}

async function writeInitialHEAD(
  rootPath: string,
  defaultBranch: string = "main"
) {
  const content = `ref: refs/heads/${defaultBranch}\n`;
  await fs.writeFile(path.join(rootPath, "HEAD"), content);
}

export default init;
