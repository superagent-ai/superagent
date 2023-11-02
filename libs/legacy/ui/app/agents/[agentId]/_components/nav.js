"use client";
import { useState } from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Box,
  Code,
  Divider,
  HStack,
  FormControl,
  Icon,
  IconButton,
  Input,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Stack,
  Switch,
  Spinner,
  useToast,
  useDisclosure,
  StackDivider,
  useColorModeValue,
} from "@chakra-ui/react";
import crypto from "crypto";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  TbChevronLeft,
  TbAlertTriangle,
  TbLink,
  TbShare,
  TbApps,
  TbCode,
  TbCopy,
} from "react-icons/tb";
import NextLink from "next/link";
import { CodeBlock, dracula } from "react-code-blocks";
import API from "@/lib/api";
import { useCallback } from "react";

const algorithm = "aes-128-cbc";
const key = process.env.NEXT_PUBLIC_SHARABLE_KEY_SECRET;
const iv = crypto.randomBytes(16);

const encrypt = (token) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let ciphertext = cipher.update(token, "utf8", "hex");
  ciphertext += cipher.final("hex");
  const encryptedData = iv.toString("hex") + ciphertext;
  return encryptedData;
};

export default function AgentNavbar({ agent, apiToken, hasApiTokenWarning }) {
  const {
    isOpen: isShareModalOpen,
    onOpen: onShareModalOpen,
    onClose: onShareModalClose,
  } = useDisclosure();
  const {
    isOpen: isEmbedModalOpen,
    onOpen: onEmbedModalOpen,
    onClose: onEmbedModalClose,
  } = useDisclosure();
  const [isChecked, setIsChecked] = useState(agent.isPublic);
  const [isListingChecked, setIsListingChecked] = useState(agent.isListed);
  const [isChangingShareStatus, setIsChangingShareStatus] = useState();
  const [isChangingListingStatus, setIsChangingListingStatus] = useState();
  const router = useRouter();
  const session = useSession();
  const toast = useToast();
  const embedCode = `<!-- This can be placed anywhere -->
<div id="superagent-chat"></div>

<!-- This should be placed before the 
closing </body> tag -->
<script src="https://unpkg.com/superagent-chat-embed/dist/web.js"></script>
<script>
Superagent({
  agentId: "${agent?.id}",
  apiKey: "${apiToken?.token}",
  type: "inline"
});
</script>`;

  const handleShareUpdate = useCallback(
    async (event) => {
      setIsChecked(event.target.checked);
      setIsChangingShareStatus(true);

      const api = new API(session.data);

      await api.patchAgent(agent.id, {
        isPublic: event.target.checked,
        shareableToken: encrypt(apiToken?.token),
      });

      router.refresh();
      setIsChangingShareStatus();
    },
    [agent, router, session]
  );

  const handleListingStatus = useCallback(
    async (event) => {
      setIsListingChecked(event.target.checked);
      setIsChangingListingStatus(true);

      const api = new API(session.data);

      await api.patchAgent(agent.id, { isListed: event.target.checked });

      router.refresh();
      setIsChangingListingStatus();
    },
    [agent, router, session]
  );

  const getShareLink = () => {
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://legacy.superagent.sh";

    return `${baseUrl}/share?agentId=${agent.id}&token=${encrypt(
      apiToken?.token
    )}`;
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content || getShareLink());

    toast({
      description: "Copied to clipboard!",
      position: "top",
      colorScheme: "gray",
    });
  };

  return (
    <>
      <HStack
        paddingY={4}
        paddingX={6}
        justifyContent="space-between"
        width="100%"
        minHeight="75px"
      >
        <HStack spacing={4} flex={1}>
          <NextLink passHref href="/agents">
            <IconButton size="xs" icon={<Icon as={TbChevronLeft} />} />
          </NextLink>
          <Text fontWeight="bold">{agent.name}</Text>
          {hasApiTokenWarning && (
            <HStack>
              <Icon as={TbAlertTriangle} color="orange.500" />
              <Text color="orange.500">
                Create an{" "}
                <NextLink passHref href="/api-tokens">
                  <Link textDecoration="underline">API token</Link>
                </NextLink>{" "}
                to run this agent.
              </Text>
            </HStack>
          )}
        </HStack>
        {apiToken && (
          <HStack>
            <Button leftIcon={<Icon as={TbCode} />} onClick={onEmbedModalOpen}>
              Embed
            </Button>
            <Button leftIcon={<Icon as={TbShare} />} onClick={onShareModalOpen}>
              Share
            </Button>
            <Modal isOpen={isShareModalOpen} onClose={onShareModalClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Share settings</ModalHeader>
                <ModalCloseButton />
                <ModalBody paddingBottom={5}>
                  <Stack>
                    <Text
                      fontSize="md"
                      color={useColorModeValue("gray.500", "gray.300")}
                    >
                      Use the following link to share your agents with users
                      outside of Superagent.
                    </Text>
                    <HStack>
                      <Input value={getShareLink()} isDisabled={true} />
                      <Button
                        colorScheme="green"
                        isDisabled={!agent.isPublic}
                        onClick={() => copyToClipboard()}
                        size="sm"
                        leftIcon={<Icon as={TbLink} fontSize="xl" />}
                      >
                        Link
                      </Button>
                    </HStack>
                  </Stack>
                  <Stack divider={<StackDivider />} marginTop={5}>
                    <HStack justifyContent="space-between">
                      <HStack spacing={4}>
                        <Icon as={TbShare} fontSize="4xl" />
                        <Stack spacing={0}>
                          <Text as="b">Public access</Text>
                          <Text
                            fontSize="sm"
                            color={useColorModeValue("gray.500", "gray.300")}
                          >
                            Make this Agent publicly accessible
                          </Text>
                        </Stack>
                      </HStack>
                      <Box>
                        <FormControl>
                          {isChangingShareStatus ? (
                            <Spinner size="sm" />
                          ) : (
                            <Switch
                              isChecked={isChecked}
                              colorScheme="green"
                              onChange={handleShareUpdate}
                            />
                          )}
                        </FormControl>
                      </Box>
                    </HStack>
                    <HStack justifyContent="space-between">
                      <HStack spacing={4}>
                        <Icon as={TbApps} fontSize="4xl" />
                        <Stack spacing={0}>
                          <Text as="b">List in library</Text>
                          <Text
                            fontSize="sm"
                            color={useColorModeValue("gray.500", "gray.300")}
                          >
                            List this agent in public agent library
                          </Text>
                        </Stack>
                      </HStack>
                      <Box>
                        <FormControl display="flex" alignItems="center">
                          {isChangingListingStatus ? (
                            <Spinner size="sm" />
                          ) : (
                            <Switch
                              isChecked={isListingChecked}
                              colorScheme="green"
                              id="is-visible"
                              onChange={handleListingStatus}
                            />
                          )}
                        </FormControl>
                      </Box>
                    </HStack>
                  </Stack>
                </ModalBody>
              </ModalContent>
            </Modal>
            <Modal
              size="lg"
              isOpen={isEmbedModalOpen}
              onClose={onEmbedModalClose}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Embed agent</ModalHeader>
                <ModalCloseButton />
                <ModalBody paddingBottom={5}>
                  <Stack spacing={4}>
                    <Text fontSize="md">
                      Copy the following code and place it before the closing{" "}
                      <Code>{"</body>"}</Code> tag. You can choose between{" "}
                      <Code>inline</Code> or <Code>popup</Code> as options.
                    </Text>
                    <Box fontFamily="monospace" position="relative">
                      <IconButton
                        icon={<Icon as={TbCopy} fontSize="xl" />}
                        position="absolute"
                        top={2}
                        right={2}
                        onClick={() => copyToClipboard(embedCode)}
                      />
                      <CodeBlock
                        text={embedCode}
                        language="html"
                        showLineNumbers
                        theme={dracula}
                      />
                    </Box>
                  </Stack>
                </ModalBody>
              </ModalContent>
            </Modal>
          </HStack>
        )}
      </HStack>
      <Divider />
      {!apiToken && (
        <Alert status="warning" borderRadius="none">
          <AlertIcon />
          <AlertTitle fontSize="md">Missing API token</AlertTitle>
          <AlertDescription fontSize="md">
            You need to create an API token before running this agent.{" "}
            <NextLink passHref href="/api-tokens">
              <Link textDecoration="underline">Create a token</Link>
            </NextLink>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
