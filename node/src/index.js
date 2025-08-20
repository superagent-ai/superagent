#!/usr/bin/env node
import ProxyServer from './server.js';

// Parse command line arguments for config path
const args = process.argv.slice(2);
const configIndex = args.indexOf('--config');
const configPath = (configIndex !== -1 && configIndex + 1 < args.length) ? 
  args[configIndex + 1] : 
  'config.yaml';

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