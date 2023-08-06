"use client";
import { useState } from "react";
import {
  Button,
  Box,
  Divider,
  HStack,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Link,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  Stack,
  Switch,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import crypto from "crypto";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { TbChevronLeft, TbAlertTriangle, TbCopy, TbLink } from "react-icons/tb";
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

  const copyToClipboard = () => {
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://app.superagent.sh";

    navigator.clipboard.writeText(
      `${baseUrl}/share?agentId=${agent.id}&token=${encrypt(apiToken?.token)}`
    );

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
            <Popover>
              <PopoverTrigger>
                <Button rightIcon={<Icon as={TbCopy} fontSize="xl" />}>
                  Share
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverCloseButton />
                <PopoverHeader fontSize="md" fontWeight="bold">
                  Sharing options
                </PopoverHeader>
                <PopoverBody>
                  <Stack>
                    <HStack>
                      <FormControl display="flex" alignItems="center">
                        {isChangingShareStatus ? (
                          <Spinner size="sm" />
                        ) : (
                          <Switch
                            isChecked={isChecked}
                            colorScheme="green"
                            id="is-visible"
                            onChange={handleShareUpdate}
                          />
                        )}
                        <FormLabel
                          htmlFor="is-visible"
                          marginBottom="0"
                          marginLeft={2}
                        >
                          Create public chat
                        </FormLabel>
                      </FormControl>
                      <Button
                        isDisabled={!agent.isPublic}
                        variant="ghost"
                        onClick={() => copyToClipboard()}
                        size="sm"
                        leftIcon={<Icon as={TbLink} fontSize="xl" />}
                      >
                        Link
                      </Button>
                    </HStack>
                    <HStack>
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
                        <FormLabel
                          htmlFor="is-visible"
                          marginBottom="0"
                          marginLeft={2}
                        >
                          List in library
                        </FormLabel>
                      </FormControl>
                    </HStack>
                  </Stack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
        )}
      </HStack>
      <Divider />
    </>
  );
}
