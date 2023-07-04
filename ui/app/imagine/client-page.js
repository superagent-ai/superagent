"use client";
import {
  Icon,
  Heading,
  HStack,
  Stack,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Circle,
} from "@chakra-ui/react";
import API from "@/lib/api";
import { BsStars } from "react-icons/bs";
import { TbSend } from "react-icons/tb";

export default function ImagineClientPage({ data, session }) {
  const api = new API(session);

  return (
    <Stack
      flex={1}
      paddingX={12}
      paddingY={12}
      spacing={12}
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <HStack justifyContent="space-between" spacing={12}>
        <Stack alignItems="center">
          <Icon as={BsStars} fontSize="2xl" color="purple.500" />
          <Heading as="h1" fontSize="2xl">
            Imagine
          </Heading>
          <Text color="gray.400">Create an agent using natural language.</Text>
        </Stack>
      </HStack>
      <Stack
        height="400px"
        alignItems="flex-start"
        minWidth="2xl"
        padding={4}
        backgroundColor="#111"
        borderRadius="md"
        borderWidth="1px"
      >
        <HStack>
          <Circle backgroundColor="purple.500" height={2} width={2} />
          <Text>Hello, what can I assist you with?</Text>
        </HStack>
      </Stack>
      <Stack spacing={4}>
        <InputGroup boxShadow="lg" backgroundColor="#111">
          <Input
            minWidth="2xl"
            type="text"
            size="lg"
            fontSize="md"
            placeholder="Create an agent that has access to the internet"
          />
          <InputRightElement>
            <IconButton
              size="sm"
              icon={<Icon as={TbSend} />}
              marginTop={2}
              marginRight={2}
            />
          </InputRightElement>
        </InputGroup>
        <Text textAlign="center" fontSize="sm" color="gray.500">
          This is agent was built with Superagent
        </Text>
      </Stack>
    </Stack>
  );
}
