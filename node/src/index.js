#!/usr/bin/env node
import ProxyServer from './server.js';

const port = process.env.PORT || process.env.VIBEKIT_PROXY_PORT || 8080;
const proxy = new ProxyServer(port);

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