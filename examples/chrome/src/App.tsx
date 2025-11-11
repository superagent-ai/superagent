"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { PromptBox } from "@/components/ui/prompt-input";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Branch, BranchMessages } from "@/components/ai-elements/branch";
import { Message } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { Check, X } from "lucide-react";

const AUTO_CONTINUE_TOKEN = "__AUTO_CONTINUE__";

function App() {
  const { messages, sendMessage, addToolResult, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: import.meta.env.AGENT_API_URL || "http://localhost:3000/api/chat",
    }),
    // Don't use sendAutomaticallyWhen since we manually send screenshot messages
    // The screenshot message will trigger a new AI response automatically
    async onToolCall({ toolCall }: { toolCall: any }) {
      const triggerAutoContinue = (reason: string) => {
        setTimeout(() => {
          sendMessage({ text: AUTO_CONTINUE_TOKEN }).catch((err: any) => {
            console.error(`Failed to trigger continue after ${reason}:`, err);
          });
        }, 0);
      };
      console.log("Tool call received:", toolCall);

      // Don't handle dynamic tools
      if (toolCall.dynamic) {
        return;
      }

      // Handle screenshot tool
      if (toolCall.toolName === "takeScreenshot") {
        chrome.runtime.sendMessage({ action: "takeScreenshot" }, (response) => {
          if (response?.success && response?.data?.screenshot) {
            // Store viewport info globally so we can use it for click scaling
            (window as any).viewportInfo = response.data.viewport;

            console.log("Viewport info:", response.data.viewport);

            // First, acknowledge the tool call with viewport dimensions
            const vp = response.data.viewport;
            addToolResult({
              tool: "takeScreenshot",
              toolCallId: toolCall.toolCallId,
              output: `Screenshot captured. The screenshot shows a ${vp.width}x${vp.height} viewport. When providing click coordinates, use coordinates based on this ${vp.width}x${vp.height} resolution.`,
            });

            // Then send the image as a user message with file part
            sendMessage({
              parts: [
                {
                  type: "file",
                  url: response.data.screenshot,
                  mediaType: "image/jpeg",
                },
              ],
            });
          } else {
            addToolResult({
              tool: "takeScreenshot",
              toolCallId: toolCall.toolCallId,
              output: `Failed to take screenshot: ${
                response?.error || "Unknown error"
              }`,
            });
            triggerAutoContinue("takeScreenshot (error)");
          }
        });
      }

      // Handle get text content tool
      if (toolCall.toolName === "getTextContent") {
        chrome.runtime.sendMessage({ action: "getTextContent" }, (response) => {
          if (response?.success && response?.data?.text) {
            addToolResult({
              tool: "getTextContent",
              toolCallId: toolCall.toolCallId,
              output: response.data.text,
            });
            triggerAutoContinue("getTextContent");
          } else {
            addToolResult({
              tool: "getTextContent",
              toolCallId: toolCall.toolCallId,
              output: `Failed to get text content: ${
                response?.error || "Unknown error"
              }`,
            });
            triggerAutoContinue("getTextContent (error)");
          }
        });
      }

      // Handle get HTML tool
      if (toolCall.toolName === "getHTML") {
        chrome.runtime.sendMessage({ action: "getPageHTML" }, (response) => {
          if (response?.success && response?.data?.html) {
            addToolResult({
              tool: "getHTML",
              toolCallId: toolCall.toolCallId,
              output: response.data.html,
            });
            triggerAutoContinue("getHTML");
          } else {
            addToolResult({
              tool: "getHTML",
              toolCallId: toolCall.toolCallId,
              output: `Failed to get HTML: ${
                response?.error || "Unknown error"
              }`,
            });
            triggerAutoContinue("getHTML (error)");
          }
        });
      }

      // Handle get interactive elements tool
      if (toolCall.toolName === "getInteractiveElements") {
        chrome.runtime.sendMessage(
          { action: "getInteractiveElements" },
          (response) => {
            if (response?.success && response?.data?.elements) {
              const elements = response.data.elements;

              // Format the elements list for display - limit to first 50 chars of text for brevity
              const elementsList = elements
                .map((el: any) => {
                  const parts = [];
                  if (el.text)
                    parts.push(`text: "${el.text.substring(0, 50)}"`);
                  if (el.tagName) parts.push(`tag: ${el.tagName}`);
                  if (el.ariaLabel) parts.push(`aria-label: "${el.ariaLabel}"`);
                  if (el.href) parts.push(`href: ${el.href}`);
                  if (el.id) parts.push(`id: ${el.id}`);
                  return `Index ${el.index}: ${parts.join(", ")}`;
                })
                .join("\n");

              // Add tool result which will trigger the AI to continue with the next action
              addToolResult({
                tool: "getInteractiveElements",
                toolCallId: toolCall.toolCallId,
                output: `Found ${elements.length} interactive elements. Now analyze the list and call the click tool with the appropriate index for the element the user requested:\n${elementsList}`,
              });
              triggerAutoContinue("getInteractiveElements");
            } else {
              addToolResult({
                tool: "getInteractiveElements",
                toolCallId: toolCall.toolCallId,
                output: `Failed to get interactive elements: ${
                  response?.error || "Unknown error"
                }`,
              });
              triggerAutoContinue("getInteractiveElements (error)");
            }
          }
        );
      }

      // Handle click tool
      if (toolCall.toolName === "click") {
        const { index } = toolCall.input;

        if (index === undefined || index === null) {
          addToolResult({
            tool: "click",
            toolCallId: toolCall.toolCallId,
            output: `Failed to click: index must be provided`,
          });
          triggerAutoContinue("click (missing index)");
          return;
        }

        console.log("Click tool called with index:", index);

        chrome.runtime.sendMessage(
          { action: "clickElementByIndex", index },
          (response) => {
            console.log("Click by index response:", response);
            if (response?.success && response?.data?.clicked) {
              const element = response.data.element || "unknown";
              const text = response.data.text || "";
              addToolResult({
                tool: "click",
                toolCallId: toolCall.toolCallId,
                output: `Clicked element at index ${index} (${element})${
                  text ? ": " + text : ""
                }`,
              });
              triggerAutoContinue("click");
            } else {
              addToolResult({
                tool: "click",
                toolCallId: toolCall.toolCallId,
                output: `Failed to click element at index ${index}: ${
                  response?.error || response?.data?.message || "Unknown error"
                }`,
              });
              triggerAutoContinue("click (error)");
            }
          }
        );
      }

      // Handle navigate to URL tool
      if (toolCall.toolName === "navigateToUrl") {
        const { url } = toolCall.input;
        chrome.runtime.sendMessage(
          { action: "navigateToUrl", url },
          (response) => {
            if (response?.success) {
              addToolResult({
                tool: "navigateToUrl",
                toolCallId: toolCall.toolCallId,
                output: response.data.message || `Navigated to ${url}`,
              });
              triggerAutoContinue("navigateToUrl");
            } else {
              addToolResult({
                tool: "navigateToUrl",
                toolCallId: toolCall.toolCallId,
                output: `Failed to navigate: ${
                  response?.error || "Unknown error"
                }`,
              });
              triggerAutoContinue("navigateToUrl (error)");
            }
          }
        );
      }

      // Handle go back tool
      if (toolCall.toolName === "goBack") {
        chrome.runtime.sendMessage({ action: "goBack" }, (response) => {
          if (response?.success) {
            addToolResult({
              tool: "goBack",
              toolCallId: toolCall.toolCallId,
              output: response.data.message || "Navigated back",
            });
            triggerAutoContinue("goBack");
          } else {
            addToolResult({
              tool: "goBack",
              toolCallId: toolCall.toolCallId,
              output: `Failed to go back: ${
                response?.error || "Unknown error"
              }`,
            });
            triggerAutoContinue("goBack (error)");
          }
        });
      }

      // Handle go forward tool
      if (toolCall.toolName === "goForward") {
        chrome.runtime.sendMessage({ action: "goForward" }, (response) => {
          if (response?.success) {
            addToolResult({
              tool: "goForward",
              toolCallId: toolCall.toolCallId,
              output: response.data.message || "Navigated forward",
            });
            triggerAutoContinue("goForward");
          } else {
            addToolResult({
              tool: "goForward",
              toolCallId: toolCall.toolCallId,
              output: `Failed to go forward: ${
                response?.error || "Unknown error"
              }`,
            });
            triggerAutoContinue("goForward (error)");
          }
        });
      }
    },
  });

  console.log("Chat status:", status);
  console.log("Messages count:", messages.length);
  if (error) console.error("Chat error:", error);

  const handleSendMessage = (message: { text: string; image?: string }) => {
    if (message.text.trim()) {
      sendMessage({ text: message.text });
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      <Conversation>
        <ConversationContent>
          {messages.map((message: any) => {
            // Hide auto-continue and screenshot messages
            const hasOnlyFiles = message.parts?.every(
              (p: any) => p.type === "file"
            );
            if (message.role === "user" && hasOnlyFiles) {
              return null;
            }
            const textParts =
              message.parts?.filter((p: any) => p.type === "text") || [];
            const combinedText = textParts.map((p: any) => p.text).join("");
            if (
              message.role === "user" &&
              combinedText === AUTO_CONTINUE_TOKEN
            ) {
              return null;
            }

            // Create a version object for Branch component
            const version = {
              id: message.id,
              content: combinedText,
            };

            return (
              <Branch defaultBranch={0} key={message.id}>
                <BranchMessages>
                  <Message from={message.role} key={message.id}>
                    {message.role === "user" ? (
                      <div className="rounded-3xl rounded-br-md border bg-secondary px-4 py-2.5 text-[15px] text-foreground max-w-[80%]">
                        {version.content}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {message.parts?.map((part: any, index: number) => {
                          // Render tools first, text will come after
                          if (part.type === "text") {
                            return null;
                          }

                          // Render tool confirmation requests
                          if (part.type === "tool-askForConfirmation") {
                            const callId = part.toolCallId;
                            switch (part.state) {
                              case "input-available":
                                return (
                                  <div
                                    key={callId}
                                    className="flex flex-col gap-2 my-2"
                                  >
                                    <p className="font-medium">
                                      {part.input?.message}
                                    </p>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          addToolResult({
                                            tool: "askForConfirmation",
                                            toolCallId: callId,
                                            output: "Yes, confirmed.",
                                          })
                                        }
                                      >
                                        <Check className="h-4 w-4 mr-1" />
                                        Yes
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          addToolResult({
                                            tool: "askForConfirmation",
                                            toolCallId: callId,
                                            output: "No, cancelled.",
                                          })
                                        }
                                      >
                                        <X className="h-4 w-4 mr-1" />
                                        No
                                      </Button>
                                    </div>
                                  </div>
                                );
                              case "output-available":
                                return (
                                  <div
                                    key={callId}
                                    className="text-xs text-muted-foreground"
                                  >
                                    ✓ {part.output}
                                  </div>
                                );
                            }
                          }

                          // Render tool calls
                          if (part.type?.startsWith("tool-")) {
                            const toolName = part.type.replace("tool-", "");

                            return (
                              <div key={index} className="my-2">
                                {part.state === "input-available" && (
                                  <div className="text-xs text-muted-foreground italic">
                                    Using {toolName}...
                                  </div>
                                )}
                                {part.state === "output-available" && (
                                  <div className="flex flex-col gap-2">
                                    <div className="text-xs text-muted-foreground">
                                      ✓ {part.output || `${toolName} completed`}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          }

                          return null;
                        })}

                        {/* Render text response after tool results */}
                        {version.content && (
                          <div className="text-[15px] text-foreground">
                            <Response>{version.content}</Response>
                          </div>
                        )}
                      </div>
                    )}
                  </Message>
                </BranchMessages>
              </Branch>
            );
          })}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="shrink-0 p-4">
        <PromptBox className="rounded-2xl" onSubmit={handleSendMessage} />
      </div>
    </div>
  );
}

export default App;
