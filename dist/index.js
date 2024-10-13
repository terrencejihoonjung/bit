#!/usr/bin/env node
import { Command } from "commander";
import init from "./commands/init.js";
import stage from "./commands/stage.js";
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
program.parse(process.argv);
