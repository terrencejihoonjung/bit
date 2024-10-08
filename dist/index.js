#!/usr/bin/env node
import { Command } from "commander";
import init from "./commands/init.js";
const program = new Command();
// Initial Configuration
program
    .name("bit")
    .description("A git clone that provides the basic necessities of a VCS")
    .version("0.0.1");
// Init Command
program
    .command("init")
    .description("Initialize a new bit repository")
    .action(init);
program.parse(process.argv);
