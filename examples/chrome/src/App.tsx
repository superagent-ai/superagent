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

const TOOL_LABELS: Record<string, string> = {
  takeScreenshot: "Screenshot captured",
  getTextContent: "Captured page text",
  getInteractiveElements: "Listed interactive elements",
  getInputElements: "Listed input fields",
  click: "Clicked element",
  inputText: "Entered text",
  navigateToUrl: "Navigated to URL",
  goBack: "Went back",
  goForward: "Went forward",
  scrollUp: "Scrolled up",
  scrollDown: "Scrolled down",
};

const summarizeToolOutput = (toolName: string, output?: unknown) => {
  const label = TOOL_LABELS[toolName] ?? toolName;
  if (typeof output !== "string") {
    return `✓ ${label}`;
  }

  const normalized = output.trim();
  if (!normalized) {
    return `✓ ${label}`;
  }

  const failed = normalized.toLowerCase().startsWith("failed");
  if (failed) {
    return `⚠️ ${normalized}`;
  }

  return `✓ ${label}`;
};

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

      const emitToolError = (toolName: string, message: string) => {
        addToolResult({
          tool: toolName,
          toolCallId: toolCall.toolCallId,
          output: message,
        });
        triggerAutoContinue(`${toolName} (error)`);
      };

      // Don't handle dynamic tools
      if (toolCall.dynamic) {
        return;
      }

      // Handle screenshot tool
      if (toolCall.toolName === "takeScreenshot") {
        if (!chrome?.runtime?.sendMessage) {
          emitToolError(
            "takeScreenshot",
            "Failed to take screenshot: chrome runtime is unavailable"
          );
          return;
        }

        try {
          chrome.runtime.sendMessage(
            { action: "takeScreenshot" },
            (response) => {
              if (chrome.runtime.lastError) {
                emitToolError(
                  "takeScreenshot",
                  `Failed to take screenshot: ${chrome.runtime.lastError.message}`
                );
                return;
              }

              if (response?.success && response?.data?.screenshot) {
                addToolResult({
                  tool: "takeScreenshot",
                  toolCallId: toolCall.toolCallId,
                  output: "Screenshot captured",
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
                emitToolError(
                  "takeScreenshot",
                  `Failed to take screenshot: ${
                    response?.error || "Unknown error"
                  }`
                );
              }
            }
          );
        } catch (error) {
          emitToolError(
            "takeScreenshot",
            `Failed to take screenshot: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      }

      // Handle get text content tool
      if (toolCall.toolName === "getTextContent") {
        if (!chrome?.runtime?.sendMessage) {
          emitToolError(
            "getTextContent",
            "Failed to get text content: chrome runtime is unavailable"
          );
          return;
        }

        let resultAdded = false;
        const addResultSafely = (output: string, isError: boolean = false) => {
          if (resultAdded) return;
          resultAdded = true;
          addToolResult({
            tool: "getTextContent",
            toolCallId: toolCall.toolCallId,
            output,
          });
          if (!isError) {
            triggerAutoContinue("getTextContent");
          }
        };

        const timeoutId = setTimeout(() => {
          if (!resultAdded) {
            console.warn("getTextContent tool timed out, adding error result");
            addResultSafely(
              "Failed to get text content: Request timed out",
              true
            );
          }
        }, 10000);

        try {
          chrome.runtime.sendMessage(
            { action: "getTextContent" },
            (response) => {
              clearTimeout(timeoutId);
              try {
                if (chrome.runtime.lastError) {
                  addResultSafely(
                    `Failed to get text content: ${chrome.runtime.lastError.message}`,
                    true
                  );
                  return;
                }

                if (!response) {
                  addResultSafely(
                    "Failed to get text content: No response received",
                    true
                  );
                  return;
                }

                if (response?.success && response?.data?.text) {
                  addResultSafely(response.data.text, false);
                } else {
                  addResultSafely(
                    `Failed to get text content: ${
                      response?.error ||
                      response?.data?.error ||
                      "Unknown error"
                    }`,
                    true
                  );
                }
              } catch (callbackError) {
                addResultSafely(
                  `Failed to get text content: ${
                    callbackError instanceof Error
                      ? callbackError.message
                      : String(callbackError)
                  }`,
                  true
                );
              }
            }
          );
        } catch (error) {
          clearTimeout(timeoutId);
          addResultSafely(
            `Failed to get text content: ${
              error instanceof Error ? error.message : String(error)
            }`,
            true
          );
        }
      }

      // Handle get interactive elements tool
      if (toolCall.toolName === "getInteractiveElements") {
        if (!chrome?.runtime?.sendMessage) {
          emitToolError(
            "getInteractiveElements",
            "Failed to get interactive elements: chrome runtime is unavailable"
          );
          return;
        }

        let resultAdded = false;
        const addResultSafely = (output: string, isError: boolean = false) => {
          if (resultAdded) return;
          resultAdded = true;
          addToolResult({
            tool: "getInteractiveElements",
            toolCallId: toolCall.toolCallId,
            output,
          });
          if (!isError) {
            triggerAutoContinue("getInteractiveElements");
          }
        };

        const timeoutId = setTimeout(() => {
          if (!resultAdded) {
            console.warn(
              "getInteractiveElements tool timed out, adding error result"
            );
            addResultSafely(
              "Failed to get interactive elements: Request timed out",
              true
            );
          }
        }, 10000);

        try {
          chrome.runtime.sendMessage(
            { action: "getInteractiveElements" },
            (response) => {
              clearTimeout(timeoutId);
              try {
                if (chrome.runtime.lastError) {
                  addResultSafely(
                    `Failed to get interactive elements: ${chrome.runtime.lastError.message}`,
                    true
                  );
                  return;
                }

                if (!response) {
                  addResultSafely(
                    "Failed to get interactive elements: No response received",
                    true
                  );
                  return;
                }

                if (response?.success && response?.data?.elements) {
                  const elements = response.data.elements;

                  // Format the elements list for display - limit to first 50 chars of text for brevity
                  const elementsList = elements
                    .map((el: any) => {
                      const parts = [];
                      if (el.text)
                        parts.push(`text: "${el.text.substring(0, 50)}"`);
                      if (el.tagName) parts.push(`tag: ${el.tagName}`);
                      if (el.ariaLabel)
                        parts.push(`aria-label: "${el.ariaLabel}"`);
                      if (el.href) parts.push(`href: ${el.href}`);
                      if (el.id) parts.push(`id: ${el.id}`);
                      return `Index ${el.index}: ${parts.join(", ")}`;
                    })
                    .join("\n");

                  addResultSafely(elementsList, false);
                } else {
                  addResultSafely(
                    `Failed to get interactive elements: ${
                      response?.error ||
                      response?.data?.error ||
                      "Unknown error"
                    }`,
                    true
                  );
                }
              } catch (callbackError) {
                addResultSafely(
                  `Failed to get interactive elements: ${
                    callbackError instanceof Error
                      ? callbackError.message
                      : String(callbackError)
                  }`,
                  true
                );
              }
            }
          );
        } catch (error) {
          clearTimeout(timeoutId);
          addResultSafely(
            `Failed to get interactive elements: ${
              error instanceof Error ? error.message : String(error)
            }`,
            true
          );
        }
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

        if (!chrome?.runtime?.sendMessage) {
          emitToolError(
            "click",
            "Failed to click: chrome runtime is unavailable"
          );
          return;
        }

        let resultAdded = false;
        const addResultSafely = (output: string, isError: boolean = false) => {
          if (resultAdded) return;
          resultAdded = true;
          addToolResult({
            tool: "click",
            toolCallId: toolCall.toolCallId,
            output,
          });
          if (!isError) {
            triggerAutoContinue("click");
          }
        };

        const timeoutId = setTimeout(() => {
          if (!resultAdded) {
            addResultSafely(
              `Failed to click element at index ${index}: Request timed out`,
              true
            );
          }
        }, 10000);

        try {
          chrome.runtime.sendMessage(
            { action: "clickElementByIndex", index },
            (response) => {
              clearTimeout(timeoutId);
              try {
                if (chrome.runtime.lastError) {
                  addResultSafely(
                    `Failed to click element at index ${index}: ${chrome.runtime.lastError.message}`,
                    true
                  );
                  return;
                }

                if (!response) {
                  addResultSafely(
                    `Failed to click element at index ${index}: No response received`,
                    true
                  );
                  return;
                }

                if (response?.success && response?.data) {
                  if (response.data.clicked === true || response.data.element) {
                    const element = response.data.element || "unknown";
                    const text = response.data.text || "";
                    addResultSafely(
                      `Clicked element at index ${index} (${element})${
                        text ? ": " + text : ""
                      }`,
                      false
                    );
                  } else {
                    addResultSafely(
                      `Failed to click element at index ${index}: ${
                        response.data.message ||
                        response?.error ||
                        response?.data?.error ||
                        "Click action did not succeed"
                      }`,
                      true
                    );
                  }
                } else {
                  addResultSafely(
                    `Failed to click element at index ${index}: ${
                      response?.error ||
                      response?.data?.message ||
                      response?.data?.error ||
                      "Unknown error"
                    }`,
                    true
                  );
                }
              } catch (callbackError) {
                addResultSafely(
                  `Failed to click element at index ${index}: ${
                    callbackError instanceof Error
                      ? callbackError.message
                      : String(callbackError)
                  }`,
                  true
                );
              }
            }
          );
        } catch (error) {
          clearTimeout(timeoutId);
          addResultSafely(
            `Failed to click element at index ${index}: ${
              error instanceof Error ? error.message : String(error)
            }`,
            true
          );
        }
      }

      // Handle get input elements tool
      if (toolCall.toolName === "getInputElements") {
        if (!chrome?.runtime?.sendMessage) {
          emitToolError(
            "getInputElements",
            "Failed to get input elements: chrome runtime is unavailable"
          );
          return;
        }

        let resultAdded = false;
        const addResultSafely = (output: string, isError: boolean = false) => {
          if (resultAdded) return;
          resultAdded = true;
          addToolResult({
            tool: "getInputElements",
            toolCallId: toolCall.toolCallId,
            output,
          });
          if (!isError) {
            triggerAutoContinue("getInputElements");
          }
        };

        const timeoutId = setTimeout(() => {
          if (!resultAdded) {
            console.warn(
              "getInputElements tool timed out, adding error result"
            );
            addResultSafely(
              "Failed to get input elements: Request timed out",
              true
            );
          }
        }, 10000);

        try {
          chrome.runtime.sendMessage(
            { action: "getInputElements" },
            (response) => {
              clearTimeout(timeoutId);
              try {
                if (chrome.runtime.lastError) {
                  addResultSafely(
                    `Failed to get input elements: ${chrome.runtime.lastError.message}`,
                    true
                  );
                  return;
                }

                if (!response) {
                  addResultSafely(
                    "Failed to get input elements: No response received",
                    true
                  );
                  return;
                }

                if (response?.success && response?.data?.elements) {
                  const elements = response.data.elements;

                  // Format the elements list for display
                  const elementsList = elements
                    .map((el: any) => {
                      const parts = [];
                      if (el.placeholder)
                        parts.push(`placeholder: "${el.placeholder}"`);
                      if (el.type) parts.push(`type: ${el.type}`);
                      if (el.tagName) parts.push(`tag: ${el.tagName}`);
                      if (el.contentEditable)
                        parts.push(`contenteditable: true`);
                      if (el.ariaLabel)
                        parts.push(`aria-label: "${el.ariaLabel}"`);
                      if (el.id) parts.push(`id: ${el.id}`);
                      if (el.name) parts.push(`name: ${el.name}`);
                      return `Index ${el.index}: ${parts.join(", ")}`;
                    })
                    .join("\n");

                  addResultSafely(elementsList, false);
                } else {
                  addResultSafely(
                    `Failed to get input elements: ${
                      response?.error ||
                      response?.data?.error ||
                      "Unknown error"
                    }`,
                    true
                  );
                }
              } catch (callbackError) {
                addResultSafely(
                  `Failed to get input elements: ${
                    callbackError instanceof Error
                      ? callbackError.message
                      : String(callbackError)
                  }`,
                  true
                );
              }
            }
          );
        } catch (error) {
          clearTimeout(timeoutId);
          addResultSafely(
            `Failed to get input elements: ${
              error instanceof Error ? error.message : String(error)
            }`,
            true
          );
        }
      }

      // Handle input text tool
      if (toolCall.toolName === "inputText") {
        const { index, text } = toolCall.input;

        if (index === undefined || index === null) {
          addToolResult({
            tool: "inputText",
            toolCallId: toolCall.toolCallId,
            output: `Failed to input text: index must be provided`,
          });
          triggerAutoContinue("inputText (missing index)");
          return;
        }

        if (text === undefined || text === null) {
          addToolResult({
            tool: "inputText",
            toolCallId: toolCall.toolCallId,
            output: `Failed to input text: text must be provided`,
          });
          triggerAutoContinue("inputText (missing text)");
          return;
        }

        if (!chrome?.runtime?.sendMessage) {
          emitToolError(
            "inputText",
            "Failed to input text: chrome runtime is unavailable"
          );
          return;
        }

        console.log("Input text tool called with index:", index, "text:", text);

        let resultAdded = false;
        const addResultSafely = (output: string, isError: boolean = false) => {
          if (resultAdded) return;
          resultAdded = true;
          addToolResult({
            tool: "inputText",
            toolCallId: toolCall.toolCallId,
            output,
          });
          if (!isError) {
            triggerAutoContinue("inputText");
          }
        };

        // Timeout safety net - ensure we always add a result
        const timeoutId = setTimeout(() => {
          if (!resultAdded) {
            console.warn("Input text tool timed out, adding error result");
            addResultSafely(
              `Failed to input text at index ${index}: Request timed out`,
              true
            );
          }
        }, 10000); // 10 second timeout

        try {
          chrome.runtime.sendMessage(
            { action: "inputTextByIndex", index, text },
            (response) => {
              clearTimeout(timeoutId);
              try {
                if (chrome.runtime.lastError) {
                  addResultSafely(
                    `Failed to input text at index ${index}: ${chrome.runtime.lastError.message}`,
                    true
                  );
                  return;
                }

                console.log("Input text by index response:", response);

                // Ensure we always add a tool result, even if response is malformed
                if (!response) {
                  addResultSafely(
                    `Failed to input text at index ${index}: No response received`,
                    true
                  );
                  return;
                }

                if (response?.success && response?.data?.success) {
                  const element = response.data.element || "unknown";
                  const placeholder = response.data.placeholder || "";
                  addResultSafely(
                    `Input text into element at index ${index} (${element})${
                      placeholder ? ` with placeholder "${placeholder}"` : ""
                    }`,
                    false
                  );
                } else {
                  addResultSafely(
                    `Failed to input text at index ${index}: ${
                      response?.error ||
                      response?.data?.message ||
                      response?.data?.error ||
                      "Unknown error"
                    }`,
                    true
                  );
                }
              } catch (callbackError) {
                // Ensure tool result is added even if callback throws
                addResultSafely(
                  `Failed to input text at index ${index}: ${
                    callbackError instanceof Error
                      ? callbackError.message
                      : String(callbackError)
                  }`,
                  true
                );
              }
            }
          );
        } catch (error) {
          clearTimeout(timeoutId);
          addResultSafely(
            `Failed to input text at index ${index}: ${
              error instanceof Error ? error.message : String(error)
            }`,
            true
          );
        }
      }

      // Handle navigate to URL tool
      if (toolCall.toolName === "navigateToUrl") {
        if (!chrome?.runtime?.sendMessage) {
          emitToolError(
            "navigateToUrl",
            "Failed to navigate: chrome runtime is unavailable"
          );
          return;
        }

        const { url } = toolCall.input;
        try {
          chrome.runtime.sendMessage(
            { action: "navigateToUrl", url },
            (response) => {
              if (chrome.runtime.lastError) {
                emitToolError(
                  "navigateToUrl",
                  `Failed to navigate: ${chrome.runtime.lastError.message}`
                );
                return;
              }

              if (response?.success) {
                addToolResult({
                  tool: "navigateToUrl",
                  toolCallId: toolCall.toolCallId,
                  output: response.data.message || `Navigated to ${url}`,
                });
                triggerAutoContinue("navigateToUrl");
              } else {
                emitToolError(
                  "navigateToUrl",
                  `Failed to navigate: ${response?.error || "Unknown error"}`
                );
              }
            }
          );
        } catch (error) {
          emitToolError(
            "navigateToUrl",
            `Failed to navigate: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      }

      // Handle go back tool
      if (toolCall.toolName === "goBack") {
        if (!chrome?.runtime?.sendMessage) {
          emitToolError(
            "goBack",
            "Failed to go back: chrome runtime is unavailable"
          );
          return;
        }

        try {
          chrome.runtime.sendMessage({ action: "goBack" }, (response) => {
            if (chrome.runtime.lastError) {
              emitToolError(
                "goBack",
                `Failed to go back: ${chrome.runtime.lastError.message}`
              );
              return;
            }

            if (response?.success) {
              addToolResult({
                tool: "goBack",
                toolCallId: toolCall.toolCallId,
                output: response.data.message || "Navigated back",
              });
              triggerAutoContinue("goBack");
            } else {
              emitToolError(
                "goBack",
                `Failed to go back: ${response?.error || "Unknown error"}`
              );
            }
          });
        } catch (error) {
          emitToolError(
            "goBack",
            `Failed to go back: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      }

      // Handle go forward tool
      if (toolCall.toolName === "goForward") {
        if (!chrome?.runtime?.sendMessage) {
          emitToolError(
            "goForward",
            "Failed to go forward: chrome runtime is unavailable"
          );
          return;
        }

        try {
          chrome.runtime.sendMessage({ action: "goForward" }, (response) => {
            if (chrome.runtime.lastError) {
              emitToolError(
                "goForward",
                `Failed to go forward: ${chrome.runtime.lastError.message}`
              );
              return;
            }

            if (response?.success) {
              addToolResult({
                tool: "goForward",
                toolCallId: toolCall.toolCallId,
                output: response.data.message || "Navigated forward",
              });
              triggerAutoContinue("goForward");
            } else {
              emitToolError(
                "goForward",
                `Failed to go forward: ${response?.error || "Unknown error"}`
              );
            }
          });
        } catch (error) {
          emitToolError(
            "goForward",
            `Failed to go forward: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      }

      // Handle scroll up tool
      if (toolCall.toolName === "scrollUp") {
        if (!chrome?.runtime?.sendMessage) {
          emitToolError(
            "scrollUp",
            "Failed to scroll up: chrome runtime is unavailable"
          );
          return;
        }

        const { amount } = toolCall.input || {};

        try {
          chrome.runtime.sendMessage(
            { action: "scrollPage", direction: "up", amount },
            (response) => {
              if (chrome.runtime.lastError) {
                emitToolError(
                  "scrollUp",
                  `Failed to scroll up: ${chrome.runtime.lastError.message}`
                );
                return;
              }

              if (response?.success && response?.data) {
                const scrollInfo = response.data;
                const scrollAmount = amount || scrollInfo.viewportHeight;
                addToolResult({
                  tool: "scrollUp",
                  toolCallId: toolCall.toolCallId,
                  output: `Scrolled up by ${scrollAmount}px. Current scroll position: ${scrollInfo.scrollY}px`,
                });
                triggerAutoContinue("scrollUp");
              } else {
                emitToolError(
                  "scrollUp",
                  `Failed to scroll up: ${response?.error || "Unknown error"}`
                );
              }
            }
          );
        } catch (error) {
          emitToolError(
            "scrollUp",
            `Failed to scroll up: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      }

      // Handle scroll down tool
      if (toolCall.toolName === "scrollDown") {
        if (!chrome?.runtime?.sendMessage) {
          emitToolError(
            "scrollDown",
            "Failed to scroll down: chrome runtime is unavailable"
          );
          return;
        }

        const { amount } = toolCall.input || {};

        try {
          chrome.runtime.sendMessage(
            { action: "scrollPage", direction: "down", amount },
            (response) => {
              if (chrome.runtime.lastError) {
                emitToolError(
                  "scrollDown",
                  `Failed to scroll down: ${chrome.runtime.lastError.message}`
                );
                return;
              }

              if (response?.success && response?.data) {
                const scrollInfo = response.data;
                const scrollAmount = amount || scrollInfo.viewportHeight;
                addToolResult({
                  tool: "scrollDown",
                  toolCallId: toolCall.toolCallId,
                  output: `Scrolled down by ${scrollAmount}px. Current scroll position: ${scrollInfo.scrollY}px`,
                });
                triggerAutoContinue("scrollDown");
              } else {
                emitToolError(
                  "scrollDown",
                  `Failed to scroll down: ${response?.error || "Unknown error"}`
                );
              }
            }
          );
        } catch (error) {
          emitToolError(
            "scrollDown",
            `Failed to scroll down: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
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
                                      {summarizeToolOutput(
                                        toolName,
                                        part.output
                                      )}
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
