#!/usr/bin/env node
import { Command } from 'commander';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import ProxyServer from './server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

const execAsync = promisify(exec);
const program = new Command();

program
  .name('ai-firewall')
  .description('AI firewall server for secure API routing')
  .version(packageJson.version)
  .option('-p, --port <number>', 'Port to run on', '8080')
  .option('-c, --config <path>', 'Path to superagent.yaml file', 'superagent.yaml');

program
  .command('start')
  .description('Start the proxy server')
  .option('-p, --port <number>', 'Port to run on', '8080')
  .option('-c, --config <path>', 'Path to superagent.yaml file', 'superagent.yaml')
  .option('-d, --daemon', 'Run in background')
  .action(async (options) => {
    const port = parseInt(options.port) || 8080;
    
    if (options.daemon) {
      // For daemon mode, check if port is in use first
      if (await isPortInUse(port)) {
        process.exit(1);
      }
      const args = ['--port', port.toString()];
      if (options.config && options.config !== 'superagent.yaml') {
        args.push('--config', options.config);
      }
      const child = spawn(process.argv[0], [process.argv[1], ...args], {
        detached: true,
        stdio: 'ignore'
      });
      child.unref();
    } else {
      await startProxyWithCheck(port, options.config);
    }
  });

program
  .command('stop')
  .description('Stop the proxy server')
  .option('-p, --port <number>', 'Port to stop', '8080')
  .action(async (options) => {
    const port = parseInt(options.port) || 8080;
    
    try {
      // Find and kill process using the port
      const { stdout } = await execAsync(`lsof -ti :${port}`).catch(() => ({ stdout: '' }));
      
      if (!stdout.trim()) {
        return;
      }
      
      const pids = stdout.trim().split('\n').filter(Boolean);
      
      for (const pid of pids) {
        try {
          process.kill(parseInt(pid), 'SIGTERM');
        } catch (error) {
          // Ignore errors
        }
      }
    } catch (error) {
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Show proxy server status')
  .option('-p, --port <number>', 'Port to check', '8080')
  .action(async (options) => {
    const port = parseInt(options.port) || 8080;
    
    console.log('🌐 Proxy Server Status');
    console.log('─'.repeat(30));
    
    const running = await isPortInUse(port);
    console.log(`Port ${port}: ${running ? '✅ RUNNING' : '❌ NOT RUNNING'}`);
    
    if (running) {
      try {
        // Try to get health check
        const response = await fetch(`http://localhost:${port}/health`);
        if (response.ok) {
          const data = await response.json();
          console.log(`Uptime: ${Math.round(data.uptime)}s`);
          console.log(`Requests: ${data.requestCount}`);
        }
      } catch {
        console.log('Health check: ❌ Failed');
      }
      
      // Show process info
      try {
        const { stdout } = await execAsync(`lsof -ti :${port}`);
        const pids = stdout.trim().split('\n').filter(Boolean);
        console.log(`PIDs: ${pids.join(', ')}`);
      } catch {
        // Ignore
      }
    }
  });

async function startProxyWithCheck(port, configPath = 'superagent.yaml') {
  const proxy = new ProxyServer(port, configPath);
  
  // Handle graceful shutdown
  const shutdown = (signal) => {
    proxy.stop();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGHUP', () => shutdown('SIGHUP'));
  process.on('exit', () => proxy.stop());

  try {
    await proxy.start();
  } catch (error) {
    process.exit(1);
  }
}

async function startProxy(port) {
  return startProxyWithCheck(port);
}

async function isPortInUse(port) {
  try {
    const { stdout } = await execAsync(`lsof -ti :${port}`);
    return stdout.trim().length > 0;
  } catch {
    return false;
  }
}

// Add a default command for when no subcommand is provided
program
  .command('*')
  .description('Start the proxy server (default)')
  .action(async () => {
    const options = program.opts();
    const port = parseInt(options.port) || 8080;
    await startProxyWithCheck(port, options.config);
  });

// Parse arguments
program.parse(process.argv);