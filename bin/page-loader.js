#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();
program
  .description('Page loader utility')
  .version('0.8.0')

program.parse();