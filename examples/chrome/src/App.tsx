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
import { Check, X, Globe } from "lucide-react";
import { useState } from "react";

function App() {
  const [includePageContext, setIncludePageContext] = useState(false);
  const [pageData, setPageData] = useState<any>(null);

  const { messages, sendMessage, addToolResult, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: import.meta.env.AGENT_API_URL || "http://localhost:3000/api/chat",
    }),
    async onToolCall({ toolCall }: { toolCall: any }) {
      console.log("Tool call received:", toolCall);

      // Don't handle dynamic tools
      if (toolCall.dynamic) {
        return;
      }

      // Handle client-side tools
      if (toolCall.toolName === "getLocation") {
        // Mock location - in production, use navigator.geolocation
        const cities = ["New York", "Los Angeles", "Chicago", "San Francisco"];
        addToolResult({
          tool: "getLocation",
          toolCallId: toolCall.toolCallId,
          output: cities[Math.floor(Math.random() * cities.length)],
        });
      }
    },
  });

  console.log("Chat status:", status);
  console.log("Messages count:", messages.length);
  if (error) console.error("Chat error:", error);

  const fetchPageData = async () => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: 'getPageHTML' }, (response) => {
        if (response?.success) {
          resolve(response.data);
        } else {
          console.error('Failed to get page HTML:', response?.error);
          resolve(null);
        }
      });
    });
  };

  const handleSendMessage = async (message: { text: string; image?: string }) => {
    if (message.text.trim()) {
      let messageText = message.text;

      // If page context is enabled, fetch and prepend it
      if (includePageContext) {
        const data: any = await fetchPageData();
        if (data) {
          setPageData(data);
          // Include page context in the message
          messageText = `Page Context:
URL: ${data.url}
Title: ${data.title}
${data.description ? `Description: ${data.description}\n` : ''}
Content:
${data.bodyText.substring(0, 5000)}${data.bodyText.length > 5000 ? '...(truncated)' : ''}

---

User Question: ${message.text}`;
        }
      }

      sendMessage({ text: messageText });
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      <Conversation>
        <ConversationContent>
          {messages.map((message: any) => {
            // Collect all text parts into one string
            const textParts =
              message.parts?.filter((p: any) => p.type === "text") || [];
            const combinedText = textParts.map((p: any) => p.text).join("");

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
                        <div className="text-[15px] text-foreground">
                          <Response>{version.content}</Response>
                        </div>

                        {message.parts?.map((part: any, index: number) => {
                          // Skip text parts (already rendered above)
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
                            return (
                              <div
                                key={index}
                                className="text-xs text-muted-foreground italic my-1"
                              >
                                {part.state === "input-available" &&
                                  `Using ${part.type.replace("tool-", "")}...`}
                                {part.state === "output-available" &&
                                  `✓ ${part.type.replace(
                                    "tool-",
                                    ""
                                  )} completed`}
                              </div>
                            );
                          }

                          return null;
                        })}
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
      <div className="shrink-0 border-t bg-background">
        <div className="flex items-center justify-between px-4 py-2">
          <Button
            variant={includePageContext ? "default" : "outline"}
            size="sm"
            onClick={() => setIncludePageContext(!includePageContext)}
            className="gap-2"
          >
            <Globe className="h-4 w-4" />
            {includePageContext ? "Page Context: ON" : "Page Context: OFF"}
          </Button>
          {pageData && includePageContext && (
            <span className="text-xs text-muted-foreground">
              {pageData.title}
            </span>
          )}
        </div>
        <div className="px-4 pb-4">
          <PromptBox className="rounded-2xl" onSubmit={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}

export default App;
