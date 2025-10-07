import { createClient } from 'superagent-ai';

export async function redactCommand(args: string[]) {
  // Check for --url-whitelist flag
  const whitelistFlagIndex = args.indexOf('--url-whitelist');
  let urlWhitelist: string[] | undefined;

  if (whitelistFlagIndex !== -1) {
    // Get the value after --url-whitelist (comma-separated URLs)
    const whitelistValue = args[whitelistFlagIndex + 1];
    if (whitelistValue) {
      urlWhitelist = whitelistValue.split(',').map(url => url.trim());
      // Remove --url-whitelist and its value from args
      args.splice(whitelistFlagIndex, 2);
    } else {
      console.error('❌ ERROR: --url-whitelist requires a comma-separated list of URLs');
      process.exit(1);
    }
  }

  // Check if we have command line arguments first
  const hasArgs = args.length > 0;

  let text: string;
  let isStdin = false;

  if (!hasArgs && !process.stdin.isTTY) {
    isStdin = true;
    // Read JSON from stdin
    const stdin = await new Promise<string>((resolve) => {
      let data = '';
      process.stdin.on('data', chunk => data += chunk);
      process.stdin.on('end', () => resolve(data));
    });

    try {
      const inputData = JSON.parse(stdin);
      text = inputData.text || inputData.prompt;

      if (!text) {
        console.error('❌ ERROR: No text provided in stdin JSON');
        process.exit(2);
      }
    } catch (error) {
      console.error('❌ ERROR: Failed to parse JSON from stdin');
      process.exit(2);
    }
  } else {
    // Command line argument
    text = args.join(' ');

    if (!text) {
      console.error('Usage: superagent redact [--url-whitelist <url1,url2>] <text>');
      console.error('   or: echo \'{"text": "..."}\' | superagent redact [--url-whitelist <url1,url2>]');
      process.exit(1);
    }
  }

  // Ensure API key is available
  if (!process.env.SUPERAGENT_API_KEY) {
    console.error('❌ ERROR: SUPERAGENT_API_KEY environment variable not set');
    process.exit(2);
  }

  // Create client instance
  const client = createClient({
    apiKey: process.env.SUPERAGENT_API_KEY,
  });

  try {
    const result = await client.redact(text, { urlWhitelist });

    const output = {
      redacted: result.redacted,
      reasoning: result.reasoning,
      usage: result.usage,
    };

    console.log(JSON.stringify(output, null, 2));
    process.exit(0);
  } catch (error: any) {
    console.error(`⚠️ Redact failed: ${error.message}`);
    process.exit(2);
  }
}
