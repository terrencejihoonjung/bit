#!/usr/bin/env node

import { Command } from "commander";
import init from "./commands/init.js";
import stage from "./commands/stage.js";
import commit from "./commands/commit.js";

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

// Stage Command
program
  .command("stage [files...]")
  .alias("s")
  .description("Stage files or directories to index.")
  .action(stage);

// Commit Command
program
  .command("commit")
  .alias("c")
  .option("-m, --message <value>", "commit message")
  .description("Create a new commit with staged changes.")
  .action(async (options) => {
    await commit(options.message);
  });

program.parse(process.argv);
