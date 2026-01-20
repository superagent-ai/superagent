import { createClient } from "safety-agent";

export async function redactCommand(args: string[]) {
  // Check for --entities flag
  const entitiesFlagIndex = args.indexOf("--entities");
  let entities: string[] | undefined;

  if (entitiesFlagIndex !== -1) {
    // Get the value after --entities (comma-separated entities)
    const entitiesValue = args[entitiesFlagIndex + 1];
    if (entitiesValue) {
      entities = entitiesValue.split(",").map((entity) => entity.trim());
      // Remove --entities and its value from args
      args.splice(entitiesFlagIndex, 2);
    } else {
      console.error(
        "❌ ERROR: --entities requires a comma-separated list of entity types"
      );
      process.exit(1);
    }
  }

  // Check for --rewrite flag
  const rewriteFlagIndex = args.indexOf("--rewrite");
  let rewrite: boolean | undefined;

  if (rewriteFlagIndex !== -1) {
    rewrite = true;
    // Remove --rewrite from args
    args.splice(rewriteFlagIndex, 1);
  }

  // Check if we have command line arguments first
  const hasArgs = args.length > 0;

  let text: string;
  let isStdin = false;

  if (!hasArgs && !process.stdin.isTTY) {
    isStdin = true;
    // Read JSON from stdin
    const stdin = await new Promise<string>((resolve) => {
      let data = "";
      process.stdin.on("data", (chunk) => (data += chunk));
      process.stdin.on("end", () => resolve(data));
    });

    try {
      const inputData = JSON.parse(stdin);
      text = inputData.text || inputData.prompt;

      // Check for rewrite in stdin JSON
      if (inputData.rewrite !== undefined) {
        rewrite = Boolean(inputData.rewrite);
      }

      if (!text) {
        console.error("❌ ERROR: No text provided in stdin JSON");
        process.exit(2);
      }
    } catch (error) {
      console.error("❌ ERROR: Failed to parse JSON from stdin");
      process.exit(2);
    }
  } else {
    // Command line argument
    text = args.join(" ");

    if (!text) {
      console.error(
        "Usage: superagent redact [--entities <entity1,entity2>] [--rewrite] <text>"
      );
      console.error(
        '   or: echo \'{"text": "..."}\' | superagent redact [--entities <entity1,entity2>] [--rewrite]'
      );
      console.error("");
      console.error("Options:");
      console.error(
        "  --entities <entities>     Comma-separated list of entity types to redact"
      );
      console.error(
        "  --rewrite                 Naturally rewrite content instead of using placeholders"
      );
      console.error("");
      console.error("Examples:");
      console.error('  superagent redact "My email is john@example.com"');
      console.error(
        '  superagent redact --entities "emails,phones" "Contact: john@example.com, 555-1234"'
      );
      console.error(
        '  superagent redact --rewrite "Contact me at john@example.com"'
      );
      process.exit(1);
    }
  }

  // Ensure API key is available
  if (!process.env.SUPERAGENT_API_KEY) {
    console.error("❌ ERROR: SUPERAGENT_API_KEY environment variable not set");
    process.exit(2);
  }

  // Create client instance
  const client = createClient({
    apiKey: process.env.SUPERAGENT_API_KEY,
  });

  try {
    const result = await client.redact({
      input: text,
      model: "openai/gpt-4o-mini",
      entities,
      rewrite,
    });

    // JSON output
    const output = {
      redacted: result.redacted,
      findings: result.findings,
      usage: result.usage,
    };

    console.log(JSON.stringify(output, null, 2));
    process.exit(0);
  } catch (error: any) {
    console.error(`⚠️ Redact failed: ${error.message}`);
    process.exit(2);
  }
}
