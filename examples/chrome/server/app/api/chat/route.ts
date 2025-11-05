import { anthropic } from "@ai-sdk/anthropic";
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
    model: anthropic("claude-sonnet-4-5"),
    system: `<SYSTEM_CAPABILITY>
* You are a browser assistant operating within a Chrome extension with access to the active browser tab.
* You can take screenshots to see what's on the current page.
* You can extract the text content from the page to read detailed information.
* You can click at specific coordinates on the page.
* Screenshots are captured as JPEG images.
* The current date is ${new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })}.
</SYSTEM_CAPABILITY>

<IMPORTANT>
* ALWAYS start by taking a screenshot to see what's on the page - do this immediately without asking the user or mentioning it.
* After any user request, your first action should be to call takeScreenshot silently, then analyze what you see and respond based on the screenshot.
* Do not tell the user you are taking a screenshot - just do it silently in the background and use the information to answer their question.
* Use getTextContent when you need to read detailed text from the page that might be hard to read in the screenshot.
* Use getHTML to get the HTML structure and identify elements by their attributes, classes, IDs, or text content before clicking.
* When you need to click something, first use getHTML to identify the exact element, then determine its bounding box from the screenshot.
* Provide the bounding box coordinates (x1, y1, x2, y2) that surround the element you want to click.
* After clicking, take another screenshot to see the result of the click action.
* Analyze the screenshot to answer user questions about what's visible on the current page.
</IMPORTANT>`,
    messages: convertToModelMessages(messages),
    tools: {
      takeScreenshot: tool({
        description:
          "Take a screenshot of the current browser tab to see what's on the page.",
        inputSchema: z.object({}),
      }),
      getTextContent: tool({
        description:
          "Get the text content of the current browser page. This extracts all visible text from the page.",
        inputSchema: z.object({}),
      }),
      getHTML: tool({
        description:
          "Get the HTML structure of the current page. Use this to identify elements and their attributes before clicking.",
        inputSchema: z.object({}),
      }),
      click: tool({
        description:
          "Click on an element by specifying its bounding box from the screenshot. Provide the approximate bounding box coordinates of the element you want to click.",
        inputSchema: z.object({
          x1: z.number().describe("The left x coordinate of the bounding box"),
          y1: z.number().describe("The top y coordinate of the bounding box"),
          x2: z.number().describe("The right x coordinate of the bounding box"),
          y2: z.number().describe("The bottom y coordinate of the bounding box"),
        }),
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
