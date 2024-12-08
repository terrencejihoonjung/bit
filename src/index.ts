#!/usr/bin/env node

import { Command } from "commander";
import init from "./commands/init.js";
import stage from "./commands/stage.js";
import unstage from "./commands/unstage.js";
import commit from "./commands/commit.js";
import log from "./commands/log.js";
import status from "./commands/status.js";
import { switchBranch, createBranch } from "./commands/switch.js";

const program = new Command();

// Initial Configuration
program
  .name("bit")
  .description("A git clone that provides the basic necessities of a VCS")
  .version("0.0.1");

// Init Command
program
  .command("init")
  .alias("i")
  .description("Initialize a new bit repository")
  .action(init);

// Status Command
program
  .command("status")
  .description("Check status of staged files.")
  .action(status);

// Stage Command
program
  .command("stage [files...]")
  .alias("s")
  .description("Stage files or directories to index.")
  .action(stage);

// Unstage Command
program
  .command("unstage [files...]")
  .description("Unstage files or directories to index.")
  .action(unstage);

// Commit Command
program
  .command("commit")
  .alias("c")
  .option("-m, --message <value>", "commit message")
  .description("Create a new commit with staged changes.")
  .action(async (options) => {
    await commit(options.message);
  });

// Log Command
program
  .command("log")
  .alias("l")
  .description("Display commit history")
  .action(log);

program
  .command("switch <branch>")
  .description("Switch to an existing branch")
  .option("-c, --create", "Create and switch to a new branch")
  .action(async (branch, options) => {
    // Create and switch to a new branch
    if (options.create) await createBranch(branch);
    await switchBranch(branch);
  });

program.parse(process.argv);
