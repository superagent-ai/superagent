#!/usr/bin/env node
import ProxyServer from './server.js';

// Parse command line arguments for config path
const args = process.argv.slice(2);
let configPath = 'vibekit.yaml';

// Handle both --config=path and --config path formats
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--config=')) {
    configPath = args[i].split('=')[1];
    break;
  } else if (args[i] === '--config' && i + 1 < args.length) {
    configPath = args[i + 1];
    break;
  }
}

const port = process.env.PORT || process.env.VIBEKIT_PROXY_PORT || 8080;
const proxy = new ProxyServer(port, configPath);

// Handle graceful shutdown
const shutdown = (signal) => {
  proxy.stop();
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGHUP', () => shutdown('SIGHUP'));

// Keep process alive
process.on('exit', () => {
  proxy.stop();
});

proxy.start().then(() => {
}).catch(() => {
  process.exit(1);
});