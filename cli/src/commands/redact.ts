import { createClient } from 'superagent-ai';
import { readFileSync } from 'fs';

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

  // Check for --entities flag
  const entitiesFlagIndex = args.indexOf('--entities');
  let entities: string[] | undefined;

  if (entitiesFlagIndex !== -1) {
    // Get the value after --entities (comma-separated entities)
    const entitiesValue = args[entitiesFlagIndex + 1];
    if (entitiesValue) {
      entities = entitiesValue.split(',').map(entity => entity.trim());
      // Remove --entities and its value from args
      args.splice(entitiesFlagIndex, 2);
    } else {
      console.error('❌ ERROR: --entities requires a comma-separated list of entity types');
      process.exit(1);
    }
  }

  // Check for --file flag
  const fileFlagIndex = args.indexOf('--file');
  let file: Blob | undefined;
  let filePath: string | undefined;
  let format: "json" | "pdf" = "json"; // Default to JSON format

  if (fileFlagIndex !== -1) {
    filePath = args[fileFlagIndex + 1];
    if (filePath) {
      try {
        const fileBuffer = readFileSync(filePath);
        file = new Blob([fileBuffer], { type: 'application/pdf' });
        format = 'pdf'; // Request PDF output when file is provided
        // Remove --file and its value from args
        args.splice(fileFlagIndex, 2);
      } catch (error: any) {
        console.error(`❌ ERROR: Failed to read file: ${error.message}`);
        process.exit(1);
      }
    } else {
      console.error('❌ ERROR: --file requires a file path');
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
      console.error('Usage: superagent redact [--url-whitelist <url1,url2>] [--entities <entity1,entity2>] [--file <path>] <text>');
      console.error('   or: echo \'{"text": "..."}\' | superagent redact [--url-whitelist <url1,url2>] [--entities <entity1,entity2>]');
      console.error('');
      console.error('Options:');
      console.error('  --url-whitelist <urls>    Comma-separated list of URL prefixes to not redact');
      console.error('  --entities <entities>     Comma-separated list of entity types to redact');
      console.error('  --file <path>            Path to PDF file to redact');
      console.error('');
      console.error('Examples:');
      console.error('  superagent redact "My email is john@example.com"');
      console.error('  superagent redact --entities "emails,phones" "Contact: john@example.com, 555-1234"');
      console.error('  superagent redact --file document.pdf "Analyze this document"');
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
    const result = await client.redact(text, {
      urlWhitelist,
      entities,
      file,
      format: file ? format : undefined // Only send format if file is provided
    });

    // If PDF blob is returned, save it to a file
    if (result.pdf) {
      const { writeFileSync } = await import('fs');
      const { basename, extname } = await import('path');

      // Generate output filename based on original file with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T').join('_').slice(0, -5);
      let outputPath: string;

      if (filePath) {
        const filename = basename(filePath, extname(filePath));
        const extension = extname(filePath) || '.pdf';
        outputPath = `${filename}_redacted_${timestamp}${extension}`;
      } else {
        outputPath = `redacted_${timestamp}.pdf`;
      }

      const arrayBuffer = await result.pdf.arrayBuffer();
      writeFileSync(outputPath, Buffer.from(arrayBuffer));

      console.log(JSON.stringify({
        message: `Redacted PDF saved to ${outputPath}`,
        reasoning: result.reasoning,
        usage: result.usage,
      }, null, 2));
      process.exit(0);
    }

    // JSON output
    const output = {
      redacted: result.redacted,
      reasoning: result.reasoning,
      usage: result.usage,
      ...(result.redacted_pdf && { redacted_pdf: 'Base64 PDF data (truncated for display)' })
    };

    console.log(JSON.stringify(output, null, 2));
    process.exit(0);
  } catch (error: any) {
    console.error(`⚠️ Redact failed: ${error.message}`);
    process.exit(2);
  }
}
