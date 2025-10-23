#!/usr/bin/env node

import { guardCommand } from './commands/guard.js';
import { redactCommand } from './commands/redact.js';
import { verifyCommand } from './commands/verify.js';

function showHelp() {
  console.log('Usage: superagent <command> [options]');
  console.log('');
  console.log('AI security and privacy toolkit');
  console.log('');
  console.log('Commands:');
  console.log('  guard   Analyze prompts for security threats');
  console.log('  redact  Remove sensitive data from text');
  console.log('  verify  Verify claims against source materials');
  console.log('');
  console.log('Options:');
  console.log('  --help  Show help for a command');
  console.log('');
  console.log('Examples:');
  console.log('  superagent guard --help');
  console.log('  superagent redact --help');
  console.log('  superagent verify --help');
  console.log('  superagent guard "rm -rf /"');
  console.log('  superagent redact "My email is john@example.com"');
  console.log('  superagent verify --sources \'[...]\' "Claims to verify"');
}

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === '--help' || command === '-h') {
  showHelp();
  process.exit(0);
}

switch (command) {
  case 'guard':
    await guardCommand(args.slice(1));
    break;
  case 'redact':
    await redactCommand(args.slice(1));
    break;
  case 'verify':
    await verifyCommand(args.slice(1));
    break;
  default:
    console.error(`Unknown command: ${command}`);
    console.error('');
    showHelp();
    process.exit(1);
}