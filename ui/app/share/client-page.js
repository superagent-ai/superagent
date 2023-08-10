"use client";
import {
  Button,
  Box,
  Code,
  Container,
  Circle,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  Tag,
  useColorModeValue,
  Avatar,
  useToast,
  Divider,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useState } from "react";
import { TbArrowRight, TbSend, TbCopy } from "react-icons/tb";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { BeatLoader } from "react-spinners";
import { SUPERAGENT_VERSION } from "@/lib/constants";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

function LoadingMessage() {
  return (
    <Container maxW="5xl">
      <HStack spacing={4}>
        <BeatLoader color="white" size={8} />
        <Text color="#777">Thinking...</Text>
      </HStack>
    </Container>
  );
}

function Message({ agent, message, type }) {
  return (
    <Container
      maxW="5xl"
      backgroundColor={type === "ai" && "#444"}
      borderRadius="lg"
      paddingY={4}
    >
      <HStack alignItems="flex-start" spacing={4}>
        {type === "human" ? (
          <Circle
            width={4}
            height={4}
            backgroundColor="orange.500"
            marginTop={1}
          />
        ) : (
          <Avatar size="xs" src={agent.avatarUrl || "./logo.png"} />
        )}
        {type === "human" ? (
          <Text>{message}</Text>
        ) : (
          <Box>
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const value = String(children).replace(/\n$/, "");
                  const match = /language-(\w+)/.exec(className || "");

                  const handleCopyCode = () => {
                    navigator.clipboard.writeText(value);
                  };

                  return !inline ? (
                    <Box position="relative">
                      <HStack position="absolute" top={2} right={2}>
                        <Text fontSize="xs">{match && match[1]}</Text>
                        <IconButton
                          size="sm"
                          icon={<Icon as={TbCopy} fontSize="lg" />}
                          onClick={() => handleCopyCode()}
                        />
                      </HStack>
                      <SyntaxHighlighter
                        codeTagProps={{
                          style: {
                            lineHeight: "inherit",
                            fontSize: "13px",
                          },
                        }}
                        style={dracula}
                        language={(match && match[1]) || ""}
                      >
                        {value}
                      </SyntaxHighlighter>
                    </Box>
                  ) : (
                    <Code fontSize="sm" className={className} {...props}>
                      {children}
                    </Code>
                  );
                },
              }}
              remarkPlugins={[remarkGfm]}
            >
              {message}
            </ReactMarkdown>
          </Box>
        )}
      </HStack>
    </Container>
  );
}

export default function ShareClientPage({ agent, token }) {
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const fontColor = useColorModeValue("white", "white");
  const session = useSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    const { input } = values;

    setMessages((previousMessages) => [
      ...previousMessages,
      { type: "human", message: input },
    ]);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/agents/${agent.id}/predict`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          X_SUPERAGENT_API_KEY: token,
        },
        body: JSON.stringify({
          input: { input },
          has_streaming: false,
        }),
      }
    );
    const output = await response.json();

    setMessages((previousMessages) => [
      ...previousMessages,
      { type: "ai", message: output.data },
    ]);

    reset();
  };

  const handleCopyShareLink = () => {
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://app.superagent.sh";

    navigator.clipboard.writeText(
      `${baseUrl}/share?agentId=${agent.id}&token=${token}`
    );

    toast({
      description: "Share link copied!",
      position: "top",
      colorScheme: "gray",
    });
  };

  return (
    <Stack
      minHeight="100vh"
      flex={1}
      overflow="hidden"
      paddingX={[4, 6]}
      spacing={6}
      paddingY={[6, 4]}
    >
      {!session.data && (
        <HStack justifyContent="space-between">
          <HStack spacing={4}>
            <Text as="strong" color={fontColor} fontSize="lg">
              Superagent
            </Text>
            <Tag size="sm">{SUPERAGENT_VERSION}</Tag>
          </HStack>
          <HStack>
            <IconButton
              onClick={() => handleCopyShareLink()}
              icon={<Icon as={TbCopy} fontSize="lg" />}
            />
            <NextLink passHref href="/">
              <Button rightIcon={<Icon as={TbArrowRight} />}>Login</Button>
            </NextLink>
          </HStack>
        </HStack>
      )}
      <Stack
        flex={1}
        borderRadius="lg"
        justifyContent={messages.length > 0 ? "flex-start" : "center"}
        paddingX={[2, 4]}
        paddingY={[2, 10]}
        position="relative"
        overflow="hidden"
      >
        {messages.length === 0 && (
          <Container
            maxWidth="xl"
            backgroundColor="#000"
            borderWidth="1px"
            borderRadius="md"
            padding={5}
            zIndex={99999}
          >
            <Stack spacing={4}>
              <Avatar src={agent.avatarUrl || "./logo.png"} />
              <Text fontWeight="bold" fontSize="lg">
                {agent.name}
              </Text>
              <Text fontSize="md">{agent.description}</Text>
              <Divider />
              <Text color="gray.500" fontSize="sm">
                This agent was created using Superagent. It leverages the{" "}
                {agent?.llm?.model} large language model. Note that this agent
                was marked as public by it's creator.
              </Text>
              <Text color="gray.500" fontSize="sm">
                More info:{" "}
                <Link color="orange.500" href="https://www.superagent.sh">
                  superagent.sh
                </Link>
              </Text>
            </Stack>
          </Container>
        )}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          overflow="auto"
          paddingY={10}
        >
          {messages.map(({ type, message }, index) => (
            <Message key={index} agent={agent} type={type} message={message} />
          ))}
          {isSubmitting && <LoadingMessage />}
        </Box>
        <Box
          position="absolute"
          bgGradient="linear(to-t, #131416, transparent)"
          bottom={0}
          left={0}
          right={0}
          height="50px"
        />
        <Box
          position="absolute"
          bgGradient="linear(to-b, #131416, transparent)"
          top={0}
          left={0}
          right={0}
          height="50px"
        />
      </Stack>

      <InputGroup
        size="lg"
        maxWidth="5xl"
        marginX="auto"
        as="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          variant="filled"
          boxShadow="md"
          backgroundColor="#333"
          type="text"
          placeholder="Enter an input..."
          fontSize="md"
          isDisabled={isSubmitting}
          {...register("input", { required: true })}
        />
        <InputRightElement>
          <IconButton
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
            variant="ghost"
            icon={<Icon as={TbSend} />}
          />
        </InputRightElement>
      </InputGroup>
    </Stack>
  );
}
