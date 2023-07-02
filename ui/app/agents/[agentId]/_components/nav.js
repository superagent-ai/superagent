"use client";
import {
  Divider,
  HStack,
  Icon,
  IconButton,
  Link,
  Text,
} from "@chakra-ui/react";
import { TbChevronLeft, TbAlertTriangle } from "react-icons/tb";
import NextLink from "next/link";

export default function AgentNavbar({ agent, hasApiTokenWarning }) {
  return (
    <>
      <HStack paddingY={4} paddingX={6} justifyContent="space-between">
        <HStack spacing={4}>
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
      </HStack>
      <Divider />
    </>
  );
}
