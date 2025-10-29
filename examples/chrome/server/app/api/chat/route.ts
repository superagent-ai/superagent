import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 800;

export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages: convertToModelMessages(messages),
    tools: {
      // server-side tool with execute function:
      getWeatherInformation: tool({
        description: "show the weather in a given city to the user",
        inputSchema: z.object({ city: z.string() }),
        execute: async ({ city }: { city: string }) => {
          const weatherOptions = ["sunny", "cloudy", "rainy", "snowy", "windy"];
          return weatherOptions[
            Math.floor(Math.random() * weatherOptions.length)
          ];
        },
      }),
      // client-side tool that starts user interaction:
      askForConfirmation: tool({
        description: "Ask the user for confirmation.",
        inputSchema: z.object({
          message: z.string().describe("The message to ask for confirmation."),
        }),
      }),
      // client-side tool that is automatically executed on the client:
      getLocation: tool({
        description:
          "Get the user location. Always ask for confirmation before using this tool.",
        inputSchema: z.object({}),
      }),
    },
  });

  const response = result.toUIMessageStreamResponse();

  // Add CORS headers to the response
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}
