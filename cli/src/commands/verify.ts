import { createClient } from 'superagent-ai';

function showHelp() {
  console.log('Usage: superagent verify [options] <text>');
  console.log('   or: echo \'{"text": "...", "sources": [...]}\' | superagent verify');
  console.log('');
  console.log('Verify claims in text against source materials');
  console.log('');
  console.log('Options:');
  console.log('  --help            Show this help message');
  console.log('  --sources <json>  JSON string containing array of sources');
  console.log('');
  console.log('Source format:');
  console.log('  [{"name": "Source Name", "content": "...", "url": "https://..."}]');
  console.log('');
  console.log('Examples:');
  console.log('  superagent verify --sources \'[{"name":"About","content":"Founded in 2020"}]\' "The company was founded in 2020"');
  console.log('  echo \'{"text": "...", "sources": [...]}\' | superagent verify');
}

export async function verifyCommand(args: string[]) {
  // Check for --help flag
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  // Check for --sources flag
  let sources: Array<{ name: string; content: string; url?: string }> | undefined;
  const sourcesFlagIndex = args.indexOf('--sources');

  if (sourcesFlagIndex !== -1) {
    const sourcesJson = args[sourcesFlagIndex + 1];
    if (sourcesJson) {
      try {
        sources = JSON.parse(sourcesJson);
        if (!Array.isArray(sources)) {
          console.error('❌ ERROR: --sources must be a JSON array');
          process.exit(1);
        }
        // Remove --sources and its value from args
        args.splice(sourcesFlagIndex, 2);
      } catch (error: any) {
        console.error(`❌ ERROR: Failed to parse sources JSON: ${error.message}`);
        process.exit(1);
      }
    } else {
      console.error('❌ ERROR: --sources flag requires a JSON string');
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
      text = inputData.text;

      // Get sources from stdin if not provided via command line
      if (!sources && inputData.sources) {
        sources = inputData.sources;
      }

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
      showHelp();
      process.exit(1);
    }
  }

  // Validate sources
  if (!sources || !Array.isArray(sources) || sources.length === 0) {
    console.error('❌ ERROR: sources are required. Use --sources flag or provide via stdin');
    console.error('');
    showHelp();
    process.exit(1);
  }

  // Validate each source
  for (const source of sources) {
    if (!source.content || typeof source.content !== 'string') {
      console.error('❌ ERROR: Each source must have a "content" field (string)');
      process.exit(1);
    }
    if (!source.name || typeof source.name !== 'string') {
      console.error('❌ ERROR: Each source must have a "name" field (string)');
      process.exit(1);
    }
    if (source.url !== undefined && typeof source.url !== 'string') {
      console.error('❌ ERROR: If provided, "url" must be a string');
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
    const result = await client.verify(text, sources);

    const output = {
      claims: result.claims,
      usage: result.usage,
    };

    console.log(JSON.stringify(output, null, 2));
    process.exit(0);
  } catch (error: any) {
    console.error(`⚠️ Verify failed: ${error.message}`);
    if (isStdin) {
      console.error('Allowing to proceed...');
      process.exit(0);
    } else {
      process.exit(2);
    }
  }
}
