"use client";
import {
  Container,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import { TbSend } from "react-icons/tb";
export default function ShareClientPage({ agentId, token }) {
  return (
    <Stack
      maxHeight="100vh"
      flex={1}
      overflow="hidden"
      paddyingY={6}
      paddingX={12}
    >
      <Container maxWidth="6xl">
        <HStack>
          <Text>Superagent</Text>
        </HStack>
      </Container>
      <Container
        flex={1}
        maxWidth="6xl"
        backgroundColor="#222"
        borderRadius="md"
      >
        <Stack>
          <Text>Hello</Text>
        </Stack>
      </Container>

      <InputGroup size="lg" maxWidth="6xl" marginX="auto">
        <Input type="text" placeholder="Enter an input..." />
        <InputRightElement>
          <IconButton variant="ghost" icon={<Icon as={TbSend} />} />
        </InputRightElement>
      </InputGroup>
    </Stack>
  );
}
