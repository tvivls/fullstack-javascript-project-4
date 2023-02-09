#!/usr/bin/env node
import { Command } from 'commander';
import loader from '../src/index.js'
import { cwd } from 'node:process';

const program = new Command();
program
  .description('Page loader utility')
  .version('0.8.0')
  .option('-o, --output [dir]', `output dir (default: "${cwd()}")`)
  .argument('<url>')
  .action((url) => {
    const options = program.opts();
    loader(url, options.output)
  });

program.parse();