import { createClient } from "safety-agent";

function showHelp() {
  console.log("Usage: superagent scan --repo <url> [options]");
  console.log("");
  console.log(
    "Scan a repository for AI agent-targeted attacks like repo poisoning and prompt injection"
  );
  console.log("");
  console.log("Options:");
  console.log("  --help              Show this help message");
  console.log("  --repo <url>        Repository URL to scan (required)");
  console.log("  --branch <ref>      Branch, tag, or commit to checkout");
  console.log(
    "  --model <id>        Model to use (default: anthropic/claude-sonnet-4-5)"
  );
  console.log("");
  console.log("Examples:");
  console.log("  superagent scan --repo https://github.com/user/repo");
  console.log(
    "  superagent scan --repo https://github.com/user/repo --branch main"
  );
  console.log(
    "  superagent scan --repo https://github.com/user/repo --model openai/gpt-4o"
  );
}

export async function scanCommand(args: string[]) {
  // Check for --help flag
  if (args.includes("--help") || args.includes("-h")) {
    showHelp();
    process.exit(0);
  }

  // Parse --repo flag
  let repo: string | undefined;
  const repoFlagIndex = args.indexOf("--repo");
  if (repoFlagIndex !== -1) {
    repo = args[repoFlagIndex + 1];
    if (!repo || repo.startsWith("--")) {
      console.error("❌ ERROR: --repo flag requires a URL");
      process.exit(1);
    }
  }

  if (!repo) {
    console.error("❌ ERROR: --repo flag is required");
    console.error("");
    showHelp();
    process.exit(1);
  }

  // Parse --branch flag
  let branch: string | undefined;
  const branchFlagIndex = args.indexOf("--branch");
  if (branchFlagIndex !== -1) {
    branch = args[branchFlagIndex + 1];
    if (!branch || branch.startsWith("--")) {
      console.error("❌ ERROR: --branch flag requires a value");
      process.exit(1);
    }
  }

  // Parse --model flag
  let model: string | undefined;
  const modelFlagIndex = args.indexOf("--model");
  if (modelFlagIndex !== -1) {
    model = args[modelFlagIndex + 1];
    if (!model || model.startsWith("--")) {
      console.error("❌ ERROR: --model flag requires a value");
      process.exit(1);
    }
  }

  // Ensure API keys are available
  if (!process.env.SUPERAGENT_API_KEY) {
    console.error("❌ ERROR: SUPERAGENT_API_KEY environment variable not set");
    process.exit(2);
  }

  if (!process.env.DAYTONA_API_KEY) {
    console.error("❌ ERROR: DAYTONA_API_KEY environment variable not set");
    console.error(
      "The scan command requires a Daytona API key for sandbox execution."
    );
    process.exit(2);
  }

  // Create client instance
  const client = createClient({
    apiKey: process.env.SUPERAGENT_API_KEY,
  });

  console.error(`🔍 Scanning repository: ${repo}`);
  if (branch) {
    console.error(`   Branch: ${branch}`);
  }
  if (model) {
    console.error(`   Model: ${model}`);
  }
  console.error("");

  try {
    const result = await client.scan({
      repo,
      branch,
      model: model as any,
    });

    // Output result as JSON
    const output = {
      result: result.result,
      usage: result.usage,
    };
    console.log(JSON.stringify(output, null, 2));

    process.exit(0);
  } catch (error: any) {
    console.error(`❌ Scan failed: ${error.message}`);
    process.exit(2);
  }
}
