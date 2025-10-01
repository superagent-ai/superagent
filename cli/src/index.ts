#!/usr/bin/env node

import { guardCommand } from './commands/guard.js';
import { redactCommand } from './commands/redact.js';

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'guard':
    await guardCommand(args.slice(1));
    break;
  case 'redact':
    await redactCommand(args.slice(1));
    break;
  default:
    console.error(`Unknown command: ${command}`);
    console.error('Usage: superagent guard <prompt>');
    console.error('       superagent redact <text>');
    process.exit(1);
}