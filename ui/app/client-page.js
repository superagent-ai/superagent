"use client";
import NextLink from "next/link";
import {
  Alert,
  Container,
  HStack,
  Heading,
  Link,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";

export default function HomeClientPage() {
  return (
    <Container maxWidth="3xl" minHeight="100vh">
      <Stack
        paddingX={12}
        paddingY={12}
        spacing={12}
        flex={1}
        height="100vh"
        justifyContent="center"
      >
        <Alert
          variant="outline"
          borderColor="orange.500"
          borderWidth="1px"
          borderRadius="md"
        >
          Aidosys is in public beta, expect rapid updates. All feedback
          appreciated.
        </Alert>
        <Stack>
          <HStack>
            <Heading as="h1" fontSize="2xl">
              Welcome to Aidosys
            </Heading>
            <Tag size="sm">Beta</Tag>
          </HStack>
          <Text color="gray.400">
            Aidosys is a platform that enables you to create, manage and run
            AI Agents in seconds. We are currently in open beta so bare with us.
            Make sure the read the documentation on how to integrate Superagent
            with your app.
          </Text>
        </Stack>
        <NextLink passHref href="https://docs.aidosys.com">
          <Stack
            minHeight="200px"
            bgGradient="linear(to-l, gray.600, gray.800)"
            justifyContent="flex-end"
            padding={8}
            borderRadius="lg"
            transition="0.2s all"
            _hover={{ transform: "scale(1.03)" }}
          >
            <Stack maxWidth="60%">
              <Heading as="h1" fontSize="2xl">
                Documentation
              </Heading>
              <Text>
                Read more on how to get started with integrating Aidosys in
                your apps here.
              </Text>
            </Stack>
          </Stack>
        </NextLink>
        <Text>
          Contribute on{" "}
          <Link
            textDecoration="underline"
            href="https://github.com/aiden-technologies/aidosys"
          >
            Github
          </Link>
        </Text>
      </Stack>
    </Container>
  );
}
