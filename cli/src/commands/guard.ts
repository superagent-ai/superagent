import { createClient } from 'superagent-ai';
import { readFileSync } from 'fs';

function showHelp() {
  console.log('Usage: superagent guard [options] <prompt>');
  console.log('   or: echo \'{"prompt": "text"}\' | superagent guard');
  console.log('');
  console.log('Analyze prompts for security threats');
  console.log('');
  console.log('Options:');
  console.log('  --help          Show this help message');
  console.log('  --file <path>   Path to PDF file to analyze');
  console.log('');
  console.log('Examples:');
  console.log('  superagent guard "rm -rf /"');
  console.log('  superagent guard --file document.pdf "Analyze this document"');
  console.log('  echo \'{"prompt": "delete all files"}\' | superagent guard');
}

export async function guardCommand(args: string[]) {
  // Check for --help flag
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  // Check for --file flag
  let file: Blob | undefined;
  const fileFlagIndex = args.indexOf('--file');
  if (fileFlagIndex !== -1) {
    const filePath = args[fileFlagIndex + 1];
    if (filePath) {
      try {
        const fileBuffer = readFileSync(filePath);
        file = new Blob([fileBuffer], { type: 'application/pdf' });
        args.splice(fileFlagIndex, 2); // Remove --file and path from args
      } catch (error: any) {
        console.error(`❌ ERROR: Failed to read file: ${error.message}`);
        process.exit(1);
      }
    } else {
      console.error('❌ ERROR: --file flag requires a file path');
      process.exit(1);
    }
  }

  // Check if we have command line arguments first
  const hasArgs = args.length > 0;

  let prompt: string;
  let isStdin = false;

  if (!hasArgs && !process.stdin.isTTY) {
    isStdin = true;
    // Read JSON from stdin (Claude Code hook format)
    const stdin = await new Promise<string>((resolve) => {
      let data = '';
      process.stdin.on('data', chunk => data += chunk);
      process.stdin.on('end', () => resolve(data));
    });

    try {
      const inputData = JSON.parse(stdin);
      prompt = inputData.prompt;

      if (!prompt) {
        console.error('❌ ERROR: No prompt provided in stdin JSON');
        process.exit(2);
      }
    } catch (error) {
      console.error('❌ ERROR: Failed to parse JSON from stdin');
      process.exit(2);
    }
  } else {
    // Command line argument
    prompt = args.join(' ');

    if (!prompt) {
      console.error('Usage: superagent guard <prompt>');
      console.error('   or: echo \'{"prompt": "text"}\' | superagent guard');
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
    // Pass file as first parameter if provided, otherwise pass prompt
    const input = file || prompt;
    const result = await client.guard(input, {});
    const { decision, reasoning, rejected } = result;

    if (rejected) {
      if (isStdin) {
        // Claude Code hook format
        const violationInfo = decision?.violation_types?.length
          ? ` Violations: ${decision.violation_types.join(', ')}.`
          : '';
        const cweInfo = decision?.cwe_codes?.length
          ? ` CWE: ${decision.cwe_codes.join(', ')}.`
          : '';

        const response = {
          decision: 'block',
          reason: `🛡️ Superagent Guard blocked this prompt: ${reasoning}.${violationInfo}${cweInfo}`,
          hookSpecificOutput: {
            hookEventName: 'UserPromptSubmit',
            additionalContext: `Blocked by Superagent Guard - ${reasoning}`
          }
        };

        console.log(JSON.stringify(response));
      } else {
        // CLI output - JSON format matching SDK
        const output = {
          rejected: true,
          decision,
          reasoning,
        };
        console.log(JSON.stringify(output, null, 2));
        process.exit(1);
      }
    } else {
      if (!isStdin) {
        // CLI output - JSON format matching SDK
        const output = {
          rejected: false,
          decision,
          reasoning,
        };
        console.log(JSON.stringify(output, null, 2));
      }
    }

    process.exit(0);
  } catch (error: any) {
    console.error(`⚠️ Guard check failed: ${error.message}`);
    if (isStdin) {
      console.error('Allowing prompt to proceed...');
      process.exit(0);
    } else {
      process.exit(2);
    }
  }
}