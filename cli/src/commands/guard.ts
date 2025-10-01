import { createGuard } from 'superagent-ai';

export async function guardCommand(args: string[]) {
  // Check for --redacted flag
  const redactedFlagIndex = args.indexOf('--redacted');
  const enableRedaction = redactedFlagIndex !== -1;

  // Remove --redacted flag from args
  if (enableRedaction) {
    args.splice(redactedFlagIndex, 1);
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

  // Create guard instance
  const guard = createGuard({
    apiKey: process.env.SUPERAGENT_API_KEY,
    redacted: enableRedaction,
  });

  try {
    const { decision, reasoning, rejected, redacted: redactedPrompt } = await guard(prompt);

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
          ...(redactedPrompt && { redacted: redactedPrompt }),
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
          ...(redactedPrompt && { redacted: redactedPrompt }),
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