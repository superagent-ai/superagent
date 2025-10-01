import { redactSensitiveData } from 'superagent-ai';

export async function redactCommand(args: string[]) {
  // Check if we have command line arguments first
  const hasArgs = args.length > 0;

  let text: string;
  let isStdin = false;

  if (!hasArgs && !process.stdin.isTTY) {
    isStdin = true;
    // Read from stdin
    const stdin = await new Promise<string>((resolve) => {
      let data = '';
      process.stdin.on('data', chunk => data += chunk);
      process.stdin.on('end', () => resolve(data));
    });

    text = stdin.trim();

    if (!text) {
      console.error('❌ ERROR: No text provided in stdin');
      process.exit(2);
    }
  } else {
    // Command line argument
    text = args.join(' ');

    if (!text) {
      console.error('Usage: superagent redact <text>');
      console.error('   or: echo "sensitive text" | superagent redact');
      process.exit(1);
    }
  }

  try {
    const redacted = redactSensitiveData(text);

    // Output the redacted text
    console.log(redacted);

    process.exit(0);
  } catch (error: any) {
    console.error(`⚠️ Redaction failed: ${error.message}`);
    process.exit(2);
  }
}
