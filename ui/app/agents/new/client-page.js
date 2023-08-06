"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heading, Stack, Text, useToast } from "@chakra-ui/react";
import { analytics } from "@/lib/analytics";
import API from "@/lib/api";
import { getPromptVariables } from "@/lib/prompts";
import AgentType from "./_components/agent-type";
import AgentPrompt from "./_components/agent-prompt";
import AgentTool from "./_components/agent-tool";
import AgentDocument from "./_components/agent-document";
import AgentLLM from "./_components/agent-llm";
import AgentStoreInfo from "./_components/agent-store-info";

const STEP_OPTIONS = ["TYPE", "TOOL", "DOCUMENT", "PROMPT", "LLM", "INFO"];

export default function NewAgentClientPage({ session }) {
  const [activeStep, setActiveStep] = useState(STEP_OPTIONS[0]);
  const api = new API(session);
  const toast = useToast();
  const router = useRouter();
  const [data, setData] = useState({
    type: null,
    documents: [],
    tools: [],
    llm: null,
    prompt: null,
    has_memory: false,
  });

  const createAgent = async ({ name, description, avatarUrl }) => {
    let promptId;
    const { type, prompt, llm, has_memory, documents, tools } = data;

    if (prompt) {
      const prompt_ = await api.createPrompt({
        name: `${name} prompt`,
        template: prompt,
        input_variables: getPromptVariables(prompt) || [],
      });

      promptId = prompt_.id;
    }

    const agent = await api.createAgent({
      avatarUrl,
      description,
      name,
      type,
      llm,
      hasMemory: has_memory,
      promptId: promptId,
    });

    for (const document of documents) {
      await api.createAgentDocument({
        agentId: agent.id,
        documentId: document,
      });
    }

    for (const tool of tools) {
      await api.createAgentTool({
        agentId: agent.id,
        toolId: tool,
      });
    }

    if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
      analytics.track("Created Agent", {
        ...agent,
        hasTools: tools.length > 0,
        hasDocuments: documents.length > 0,
      });
    }

    toast({
      description: "New agent created",
      position: "top",
      colorScheme: "gray",
    });

    router.push("/agents");
    router.refresh();
  };

  return (
    <Stack
      paddingX={[6, 12, 12, 12]}
      paddingY={12}
      spacing={6}
      flex={1}
      overflow="auto"
    >
      <Stack>
        <Heading as="h1" fontSize="2xl">
          New agent
        </Heading>
        <Text color="gray.400">Create a new agent.</Text>
      </Stack>
      <Stack
        justifyContent="center"
        flex={1}
        spacing={4}
        borderRadius="lg"
        margin={[0, 12]}
        padding={[0, 12]}
      >
        {activeStep === "TYPE" && (
          <AgentType
            onSubmit={({ type }) => {
              const activeIndex = STEP_OPTIONS.indexOf("TYPE");
              setData({ ...data, type });
              setActiveStep(STEP_OPTIONS[activeIndex + 1]);
            }}
          />
        )}
        {activeStep === "TOOL" && (
          <AgentTool
            session={session}
            onSubmit={({ selectedTools }) => {
              const activeIndex = STEP_OPTIONS.indexOf("TOOL");
              setData({ ...data, tools: selectedTools });
              setActiveStep(STEP_OPTIONS[activeIndex + 1]);
            }}
          />
        )}

        {activeStep === "DOCUMENT" && (
          <AgentDocument
            session={session}
            onSubmit={({ selectedDocuments }) => {
              const activeIndex = STEP_OPTIONS.indexOf("DOCUMENT");
              setData({ ...data, documents: selectedDocuments });
              setActiveStep(STEP_OPTIONS[activeIndex + 1]);
            }}
          />
        )}
        {activeStep === "PROMPT" && (
          <AgentPrompt
            data={data}
            onSubmit={({ prompt }) => {
              const activeIndex = STEP_OPTIONS.indexOf("PROMPT");
              setData({ ...data, prompt });
              setActiveStep(STEP_OPTIONS[activeIndex + 1]);
            }}
          />
        )}
        {activeStep === "LLM" && (
          <AgentLLM
            data={data}
            onSubmit={({ llm, has_memory }) => {
              const activeIndex = STEP_OPTIONS.indexOf("LLM");
              setData({ ...data, llm, has_memory });
              setActiveStep(STEP_OPTIONS[activeIndex + 1]);
            }}
          />
        )}
        {activeStep === "INFO" && (
          <AgentStoreInfo
            onSubmit={async ({ name, avatarUrl, description }) => {
              await createAgent({ name, avatarUrl, description });
            }}
          />
        )}
      </Stack>
    </Stack>
  );
}
