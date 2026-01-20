#!/usr/bin/env node

import { guardCommand } from './commands/guard.js';
import { redactCommand } from './commands/redact.js';
import { scanCommand } from './commands/scan.js';

function showHelp() {
  console.log('Usage: superagent <command> [options]');
  console.log('');
  console.log('AI security and privacy toolkit');
  console.log('');
  console.log('Commands:');
  console.log('  guard   Analyze prompts for security threats');
  console.log('  redact  Remove sensitive data from text');
  console.log('  scan    Scan repositories for AI agent-targeted attacks');
  console.log('');
  console.log('Options:');
  console.log('  --help  Show help for a command');
  console.log('');
  console.log('Examples:');
  console.log('  superagent guard --help');
  console.log('  superagent redact --help');
  console.log('  superagent scan --help');
  console.log('  superagent guard "rm -rf /"');
  console.log('  superagent redact "My email is john@example.com"');
  console.log('  superagent scan --repo https://github.com/user/repo');
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
  case 'scan':
    await scanCommand(args.slice(1));
    break;
  default:
    console.error(`Unknown command: ${command}`);
    console.error('');
    showHelp();
    process.exit(1);
}