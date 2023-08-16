"use client";
import {
  Box,
  Button,
  Code,
  Center,
  Container,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  OrderedList,
  Stack,
  Text,
  useColorModeValue,
  Avatar,
  Divider,
  UnorderedList,
  useDisclosure,
  useToast,
  Card,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import {
  TbSend,
  TbCopy,
  TbAlignJustified,
  TbMenu,
  TbPlus,
} from "react-icons/tb";
import { useForm } from "react-hook-form";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { BeatLoader } from "react-spinners";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { MemoizedReactMarkdown } from "@/lib/markdown";
import { useShareSession } from "@/lib/share-session";
import { useAsync, useAsyncFn } from "react-use";

dayjs.extend(relativeTime);

function PulsatingCursor() {
  return (
    <motion.div
      initial="start"
      animate={{
        scale: [1, 1.05, 1],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 0.5,
        repeat: Infinity,
      }}
    >
      ▍
    </motion.div>
  );
}

function LoadingMessage({ name = "Bot" }) {
  return (
    <Container maxW="5xl">
      <HStack spacing={2}>
        <BeatLoader color="white" size={5} />
        <Text fontSize="md" color="gray.500">
          <Text fontWeight="bold" as="span">
            {name}
          </Text>{" "}
          is typing...
        </Text>
      </HStack>
    </Container>
  );
}

function Navbar({
  sessions = [],
  selectedSession,
  onCreate = () => {},
  onSelect = () => {},
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <HStack paddingY={[4, 4]} position="absolute" top={0}>
      <IconButton icon={<Icon as={TbMenu} />} onClick={onOpen} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        zIndex={999999}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            {sessions.length === 0 && (
              <Center flex={1}>
                <Text color="gray.500" fontSize="md">
                  No conversations found
                </Text>
              </Center>
            )}
            <Stack marginTop={10}>
              {sessions?.map(({ id, created_at, name }) => (
                <Card
                  onClick={() => onSelect(id)}
                  key={id}
                  padding={4}
                  cursor="pointer"
                  borderWidth="1px"
                  borderColor={
                    selectedSession.id === id ? "orange.500" : "transparent"
                  }
                  _hover={{ borderWidth: "1px", borderColor: "orange.500" }}
                >
                  <HStack justifyContent="space-between">
                    <Text noOfLines={1} fontSize="md">
                      {name}
                    </Text>
                    <Text noOfLines={1} fontSize="md" color="gray.500">
                      {dayjs(created_at).fromNow()}
                    </Text>
                  </HStack>
                </Card>
              ))}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Button leftIcon={<Icon as={TbPlus} />} onClick={onCreate}>
        New chat
      </Button>
    </HStack>
  );
}

function Message({ agent, message, type }) {
  const toast = useToast();

  return (
    <Container
      maxW="5xl"
      backgroundColor={type === "ai" && "#444"}
      borderRadius="lg"
      paddingY={4}
    >
      <HStack alignItems="flex-start" spacing={4}>
        {type === "human" ? (
          <Icon as={TbAlignJustified} color="gray.500" marginTop={1} />
        ) : (
          <Avatar size="xs" src={agent.avatarUrl || "./logo.png"} />
        )}
        {type === "human" ? (
          <Text>{message}</Text>
        ) : (
          <Box maxWidth="95%">
            {message.length === 0 && <PulsatingCursor />}
            <MemoizedReactMarkdown
              components={{
                a({ children, href }) {
                  return (
                    <Link href={href} color="orange.500" target="_blank">
                      {children}
                    </Link>
                  );
                },
                ol({ children }) {
                  return <OrderedList>{children}</OrderedList>;
                },
                ul({ children }) {
                  return <UnorderedList>{children}</UnorderedList>;
                },
                p({ children }) {
                  return <Text marginBottom={2}>{children}</Text>;
                },
                code({ node, inline, className, children, ...props }) {
                  const value = String(children).replace(/\n$/, "");
                  const match = /language-(\w+)/.exec(className || "");

                  const handleCopyCode = () => {
                    navigator.clipboard.writeText(value);

                    toast({
                      description: "Copied to clipboard",
                      position: "top",
                      colorScheme: "gray",
                    });
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
                        showLineNumbers
                        codeTagProps={{
                          style: {
                            lineHeight: "inherit",
                            fontSize: "13px",
                          },
                        }}
                        style={coldarkDark}
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
            </MemoizedReactMarkdown>
          </Box>
        )}
      </HStack>
    </Container>
  );
}

export default function ShareClientPage({ agent, token }) {
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [selectedSession, setSelectedSession] = useState();
  const { getSessions, updateSession, createSession } = useShareSession({
    agent,
  });
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();
  const { value: shareSessions } = useAsync(async () => {
    const sessions = await getSessions();
    const sortedSessions = sessions.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    const latestSession = sortedSessions[0];

    setSelectedSession(latestSession);

    return sortedSessions;
  }, [agent, setSelectedSession]);

  const onSubmit = async (values) => {
    const { input } = values;
    let message = "";

    setMessages((previousMessages) => [
      ...previousMessages,
      { type: "human", message: input },
    ]);

    setMessages((previousMessages) => [
      ...previousMessages,
      { type: "ai", message },
    ]);

    await fetchEventSource(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/agents/${agent.id}/predict`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          X_SUPERAGENT_API_KEY: token,
        },
        body: JSON.stringify({
          input: { input },
          has_streaming: true,
          session: selectedSession.id,
        }),
        async onmessage(event) {
          if (event.data !== "[END]") {
            message += event.data === "" ? `${event.data} \n` : event.data;
            setMessages((previousMessages) => {
              let updatedMessages = [...previousMessages];

              for (let i = updatedMessages.length - 1; i >= 0; i--) {
                if (updatedMessages[i].type === "ai") {
                  updatedMessages[i].message = message;
                  break;
                }
              }

              return updatedMessages;
            });
          }
        },
      }
    );

    if (selectedSession.name === "New chat!") {
      await updateSession(selectedSession.id, {
        name: input,
        updated_at: new Date(),
      });

      router.refresh();
    }

    reset();
  };

  const handleCreateSession = useCallback(async () => {
    const session = await createSession();

    toast({
      description: "New chat created!",
      position: "top",
      colorScheme: "gray",
    });
    setSelectedSession(session);
    setMessages([]);
    router.refresh();
  }, [toast]);

  const handleSelectSession = useCallback(
    async (id) => {
      const session = shareSessions.find(
        ({ id: sessionId }) => sessionId === id
      );

      setSelectedSession(session);
      setMessages([]);
    },
    [shareSessions]
  );

  console.log(agent.avatarUrl);

  return (
    <Stack minHeight="100vh" flex={1} overflow="hidden" spacing={6}>
      <Stack
        flex={1}
        justifyContent={messages.length > 0 ? "flex-start" : "center"}
        paddingX={4}
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
            zIndex={1}
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
          paddingX={5}
          paddingY={12}
        >
          {messages.map(({ type, message }, index) => (
            <Message key={index} agent={agent} type={type} message={message} />
          ))}
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
        <Navbar
          sessions={shareSessions}
          selectedSession={selectedSession}
          onCreate={handleCreateSession}
          onSelect={handleSelectSession}
        />
      </Stack>
      <Stack paddingX={4} paddingBottom={4}>
        {isSubmitting && <LoadingMessage name={agent.name} />}
        <InputGroup
          size="lg"
          maxWidth="5xl"
          marginX="auto"
          as="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            variant="filled"
            autoFocus={false}
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
              type="submit"
              icon={<Icon as={TbSend} />}
            />
          </InputRightElement>
        </InputGroup>
        <Text textAlign="center" fontSize="xs" color="gray.500">
          Powered by{" "}
          <Link
            fontWeight="bold"
            href="https://www.superagent.sh"
            target="_blank"
            color={useColorModeValue("black", "white")}
          >
            superagent.sh
          </Link>
        </Text>
      </Stack>
    </Stack>
  );
}
