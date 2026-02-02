import { createClient } from "safety-agent";
import { readFileSync } from "fs";

function showHelp() {
  console.log("Usage: superagent guard [options] <prompt|url>");
  console.log('   or: echo \'{"prompt": "text"}\' | superagent guard');
  console.log("");
  console.log("Analyze prompts, PDF files, or PDF URLs for security threats");
  console.log("");
  console.log("Options:");
  console.log("  --help              Show this help message");
  console.log("  --file <path>       Path to PDF file to analyze");
  console.log(
    "  --system-prompt     Optional system prompt to customize guard behavior"
  );
  console.log("  --model <id>        Model to use (default: superagent/guard-1.7b)");
  console.log("");
  console.log("Examples:");
  console.log('  superagent guard "rm -rf /"');
  console.log('  superagent guard --file document.pdf "Analyze this document"');
  console.log('  superagent guard "https://example.com/document.pdf"');
  console.log(
    '  superagent guard --system-prompt "Focus on prompt injection" "user input"'
  );
  console.log(
    '  superagent guard --model openai/gpt-4o "some potentially harmful prompt"'
  );
  console.log('  echo \'{"prompt": "delete all files"}\' | superagent guard');
}

export async function guardCommand(args: string[]) {
  // Check for --help flag
  if (args.includes("--help") || args.includes("-h")) {
    showHelp();
    process.exit(0);
  }

  // Check for --file flag
  let file: Blob | undefined;
  const fileFlagIndex = args.indexOf("--file");
  if (fileFlagIndex !== -1) {
    const filePath = args[fileFlagIndex + 1];
    if (filePath) {
      try {
        const fileBuffer = readFileSync(filePath);
        file = new Blob([fileBuffer], { type: "application/pdf" });
        args.splice(fileFlagIndex, 2); // Remove --file and path from args
      } catch (error: any) {
        console.error(`❌ ERROR: Failed to read file: ${error.message}`);
        process.exit(1);
      }
    } else {
      console.error("❌ ERROR: --file flag requires a file path");
      process.exit(1);
    }
  }

  // Check for --system-prompt flag
  let systemPrompt: string | undefined;
  const systemPromptFlagIndex = args.indexOf("--system-prompt");
  if (systemPromptFlagIndex !== -1) {
    systemPrompt = args[systemPromptFlagIndex + 1];
    if (!systemPrompt) {
      console.error("❌ ERROR: --system-prompt flag requires a value");
      process.exit(1);
    }
    args.splice(systemPromptFlagIndex, 2); // Remove --system-prompt and value from args
  }

  // Check for --model flag
  let model: string | undefined;
  const modelFlagIndex = args.indexOf("--model");
  if (modelFlagIndex !== -1) {
    model = args[modelFlagIndex + 1];
    if (!model || model.startsWith("--")) {
      console.error("❌ ERROR: --model flag requires a value");
      process.exit(1);
    }
    args.splice(modelFlagIndex, 2); // Remove --model and value from args
  }

  // Check if we have command line arguments first
  const hasArgs = args.length > 0;

  let prompt: string;
  let isStdin = false;

  if (!hasArgs && !process.stdin.isTTY) {
    isStdin = true;
    // Read JSON from stdin (Claude Code hook format)
    const stdin = await new Promise<string>((resolve) => {
      let data = "";
      process.stdin.on("data", (chunk) => (data += chunk));
      process.stdin.on("end", () => resolve(data));
    });

    try {
      const inputData = JSON.parse(stdin);
      prompt = inputData.prompt;
      // Also check for system_prompt in stdin JSON
      if (inputData.system_prompt && !systemPrompt) {
        systemPrompt = inputData.system_prompt;
      }

      if (!prompt) {
        console.error("❌ ERROR: No prompt provided in stdin JSON");
        process.exit(2);
      }
    } catch (error) {
      console.error("❌ ERROR: Failed to parse JSON from stdin");
      process.exit(2);
    }
  } else {
    // Command line argument
    prompt = args.join(" ");

    if (!prompt) {
      console.error("Usage: superagent guard <prompt>");
      console.error('   or: echo \'{"prompt": "text"}\' | superagent guard');
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
    // Pass file as first parameter if provided, otherwise pass prompt
    const input = file || prompt;
    const result = await client.guard({
      input,
      systemPrompt,
      model: model as any,
    });
    const { classification, violation_types, cwe_codes, usage } = result;
    const isBlocked = classification === "block";

    if (isBlocked) {
      if (isStdin) {
        // Claude Code hook format
        const violationInfo = violation_types?.length
          ? ` Violations: ${violation_types.join(", ")}.`
          : "";
        const cweInfo = cwe_codes?.length
          ? ` CWE: ${cwe_codes.join(", ")}.`
          : "";

        const response = {
          decision: "block",
          reason: `🛡️ Superagent Guard blocked this prompt.${violationInfo}${cweInfo}`,
          hookSpecificOutput: {
            hookEventName: "UserPromptSubmit",
            additionalContext: `Blocked by Superagent Guard`,
          },
        };

        console.log(JSON.stringify(response));
      } else {
        // CLI output - JSON format matching SDK
        const output = {
          classification,
          violation_types,
          cwe_codes,
          usage,
        };
        console.log(JSON.stringify(output, null, 2));
        process.exit(1);
      }
    } else {
      if (!isStdin) {
        // CLI output - JSON format matching SDK
        const output = {
          classification,
          violation_types,
          cwe_codes,
          usage,
        };
        console.log(JSON.stringify(output, null, 2));
      }
    }

    process.exit(0);
  } catch (error: any) {
    console.error(`⚠️ Guard check failed: ${error.message}`);
    if (isStdin) {
      console.error("Allowing prompt to proceed...");
      process.exit(0);
    } else {
      process.exit(2);
    }
  }
}
