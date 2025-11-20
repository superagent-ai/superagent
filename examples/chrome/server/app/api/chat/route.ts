import { anthropic } from "@ai-sdk/anthropic";
import { convertToModelMessages, stepCountIs, streamText, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 800;

export async function OPTIONS() {
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

  const AUTO_CONTINUE_TOKEN = "__AUTO_CONTINUE__";

  type MessagePart = {
    type?: string;
    text?: string;
  };

  type MessageLike = {
    role?: string;
    content?: MessagePart[];
    parts?: MessagePart[];
  };

  const sanitizedMessages = Array.isArray(messages)
    ? (messages as MessageLike[]).filter((message) => {
        if (message?.role !== "user") {
          return true;
        }
        const segments: MessagePart[] = Array.isArray(message.content)
          ? message.content
          : Array.isArray(message.parts)
          ? message.parts
          : [];
        return !segments.some(
          (segment) =>
            segment?.type === "text" && segment?.text === AUTO_CONTINUE_TOKEN
        );
      })
    : messages;

  const result = streamText({
    model: anthropic("claude-sonnet-4-5"),
    stopWhen: stepCountIs(100),
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

CLICKING ELEMENTS - CRITICAL WORKFLOW:
* When the user asks you to click something (e.g., "click Trust Center", "click the login button"):
  1. FIRST: Call getInteractiveElements to get the full list of clickable elements
  2. SECOND: Analyze the list and find the index of the element that matches what the user wants (match by text, ariaLabel, href, or other attributes)
  3. THIRD: IMMEDIATELY call click with that index number - DO NOT WAIT, DO NOT ASK FOR CONFIRMATION, DO NOT TELL THE USER
  4. FOURTH: Take a screenshot to show the result
* DO NOT stop after getting the elements list - you MUST proceed to click the element automatically
* DO NOT ask the user which element to click - you should determine the correct index yourself
* DO NOT explain the elements to the user - just find the right one and click it silently
* DO NOT respond with text after getting elements - immediately call click tool next

EXAMPLE CLICK FLOW:
User says: "click Trust Center"
Your response must include these tool calls IN SEQUENCE WITHOUT STOPPING:
  Tool Call 1: getInteractiveElements()
  Receive result with Index 14: text "Trust Center"
  Tool Call 2: click(index: 14)
  Tool Call 3: takeScreenshot()
  Then provide text response: "Clicked on Trust Center"

INPUTTING TEXT - CRITICAL WORKFLOW:
* When the user asks you to enter text into a field (e.g., "type 'hello' in the search box", "fill the email field with 'test@example.com'"):
  1. FIRST: Call getInputElements to get the full list of input fields (input, textarea)
  2. SECOND: Analyze the list and find the index of the field that matches what the user wants (match by placeholder, ariaLabel, id, name, or other attributes)
  3. THIRD: IMMEDIATELY call inputText with that index and the text to enter - DO NOT WAIT, DO NOT ASK FOR CONFIRMATION, DO NOT TELL THE USER
  4. FOURTH: Take a screenshot to show the result
* DO NOT stop after getting the input elements list - you MUST proceed to input the text automatically
* DO NOT ask the user which field to use - you should determine the correct index yourself
* DO NOT explain the fields to the user - just find the right one and input the text silently
* DO NOT respond with text after getting input elements - immediately call inputText tool next

EXAMPLE INPUT TEXT FLOW:
User says: "type 'hello world' in the search box"
Your response must include these tool calls IN SEQUENCE WITHOUT STOPPING:
  Tool Call 1: getInputElements()
  Receive result with Index 5: placeholder "Search...", type "text"
  Tool Call 2: inputText(index: 5, text: "hello world")
  Tool Call 3: takeScreenshot()
  Then provide text response: "Entered 'hello world' in the search field"

CRITICAL: You MUST make multiple tool calls in a single response. Do not wait for user confirmation between tools.
When you receive the elements list from getInteractiveElements or getInputElements, your very next action in the SAME response must be to call click or inputText with the appropriate index.

* You can navigate to URLs using navigateToUrl, go back using goBack, or go forward using goForward.
* You can scroll the page up or down using scrollUp and scrollDown tools. These tools accept an optional amount parameter (in pixels). If no amount is specified, they scroll by one viewport height.
* Analyze the screenshot to answer user questions about what's visible on the current page.
</IMPORTANT>`,
    messages: convertToModelMessages(
      sanitizedMessages as unknown as Parameters<
        typeof convertToModelMessages
      >[0]
    ),
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
      getInteractiveElements: tool({
        description:
          "Get a list of all interactive elements on the page with their indices. Each element has an index that can be used to click it. Use this FIRST when the user wants to click something - then immediately use the click tool with the appropriate index to click the element the user requested.",
        inputSchema: z.object({}),
      }),
      getInputElements: tool({
        description:
          "Get a list of all input fields (input, textarea) on the page with their indices. Each element has an index that can be used to input text into it. Use this FIRST when the user wants to enter text into a field - then immediately use the inputText tool with the appropriate index and text.",
        inputSchema: z.object({}),
      }),
      click: tool({
        description:
          "Click on an element by its index. Use getInteractiveElements first to get the list of elements and their indices.",
        inputSchema: z.object({
          index: z
            .number()
            .describe(
              "The index of the element to click (from getInteractiveElements)"
            ),
        }),
      }),
      inputText: tool({
        description:
          "Input text into an input field or textarea by its index. Use getInputElements first to get the list of input elements and their indices.",
        inputSchema: z.object({
          index: z
            .number()
            .describe(
              "The index of the input element to fill (from getInputElements)"
            ),
          text: z.string().describe("The text to input into the field"),
        }),
      }),
      navigateToUrl: tool({
        description:
          "Navigate to a specific URL in the current tab. Use this to go to a new page or website.",
        inputSchema: z.object({
          url: z
            .string()
            .describe(
              "The URL to navigate to (must include http:// or https://)"
            ),
        }),
      }),
      goBack: tool({
        description:
          "Navigate back to the previous page in the browser history.",
        inputSchema: z.object({}),
      }),
      goForward: tool({
        description:
          "Navigate forward to the next page in the browser history.",
        inputSchema: z.object({}),
      }),
      scrollUp: tool({
        description:
          "Scroll the page up by a specified amount (in pixels). If no amount is specified, scrolls by one viewport height.",
        inputSchema: z.object({
          amount: z
            .number()
            .optional()
            .describe(
              "Optional. Number of pixels to scroll up. If not provided, scrolls by one viewport height."
            ),
        }),
      }),
      scrollDown: tool({
        description:
          "Scroll the page down by a specified amount (in pixels). If no amount is specified, scrolls by one viewport height.",
        inputSchema: z.object({
          amount: z
            .number()
            .optional()
            .describe(
              "Optional. Number of pixels to scroll down. If not provided, scrolls by one viewport height."
            ),
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
