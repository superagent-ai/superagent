"use client";
import { useState } from "react";
import {
  Box,
  Divider,
  HStack,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Link,
  Text,
  Switch,
  Spinner,
  InputGroup,
  Input,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { TbChevronLeft, TbAlertTriangle, TbCopy } from "react-icons/tb";
import NextLink from "next/link";
import API from "@/lib/api";
import { useCallback } from "react";

export default function AgentNavbar({ agent, apiToken, hasApiTokenWarning }) {
  console.log(apiToken);
  const [isChecked, setIsChecked] = useState(agent.isPublic);
  const [isChangingShareStatus, setIsChangingShareStatus] = useState();
  const router = useRouter();
  const session = useSession();
  const toast = useToast();

  const handleShareUpdate = useCallback(
    async (event) => {
      setIsChecked(event.target.checked);
      setIsChangingShareStatus(true);

      const api = new API(session.data);

      await api.patchAgent({ id: agent.id, isPublic: event.target.checked });

      router.refresh();
      setIsChangingShareStatus();
    },
    [agent, router, session]
  );

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `https://app.superagent.sh/share?agentId=${agent.id}&token=${apiToken?.token}`
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
        <Box>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="is-visible" marginBottom="0">
              {isChangingShareStatus ? (
                <Spinner size="sm" />
              ) : isChecked ? (
                <InputGroup>
                  <Input
                    color="gray.500"
                    type="text"
                    value={`https://app.superagent.sh/share?agentId=${agent.id}`}
                  />
                  <InputRightElement>
                    <IconButton
                      variant="ghost"
                      size="sm"
                      icon={<Icon as={TbCopy} fontSize="xl" />}
                      onClick={() => copyToClipboard()}
                    />
                  </InputRightElement>
                </InputGroup>
              ) : (
                <Text>Share:</Text>
              )}
            </FormLabel>
            <Switch
              isChecked={isChecked}
              colorScheme="green"
              id="is-visible"
              onChange={handleShareUpdate}
            />
          </FormControl>
        </Box>
      </HStack>
      <Divider />
    </>
  );
}
