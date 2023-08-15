"use client";
import { useState } from "react";
import {
  Button,
  Box,
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
  InputGroup,
  InputRightElement,
  InputRightAddon,
} from "@chakra-ui/react";
import crypto from "crypto";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  TbChevronLeft,
  TbAlertTriangle,
  TbCopy,
  TbLink,
  TbShare,
  TbApps,
} from "react-icons/tb";
import NextLink from "next/link";
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isChecked, setIsChecked] = useState(agent.isPublic);
  const [isListingChecked, setIsListingChecked] = useState(agent.isListed);
  const [isChangingShareStatus, setIsChangingShareStatus] = useState();
  const [isChangingListingStatus, setIsChangingListingStatus] = useState();
  const router = useRouter();
  const session = useSession();
  const toast = useToast();

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
        : "https://app.superagent.sh";

    return `${baseUrl}/share?agentId=${agent.id}&token=${encrypt(
      apiToken?.token
    )}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareLink());

    toast({
      description: "Share link copied!",
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
          <Box>
            <Button leftIcon={<Icon as={TbShare} />} onClick={onOpen}>
              Share
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
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
          </Box>
        )}
      </HStack>
      <Divider />
    </>
  );
}
