"use client";
import NextLink from "next/link";
import {
  Button,
  Heading,
  Icon,
  Stack,
  Text,
  HStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { TbPlus } from "react-icons/tb";
import API from "@/lib/api";
import AgentCard from "./_components/card";
import { analytics } from "@/lib/analytics";

export default function AgentsClientPage({ data, session }) {
  const router = useRouter();
  const api = new API(session);

  const handleDelete = async (id) => {
    await api.deleteAgent({ id });

    if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
      analytics.track("Deleted Agent", { id });
    }

    router.refresh();
  };

  return (
    <Stack
      paddingX={[6, 12]}
      paddingY={12}
      spacing={6}
      flex={1}
      overflow="auto"
    >
      <HStack justifyContent="space-between">
        <Stack>
          <Heading as="h1" fontSize="2xl">
            Agents
          </Heading>
          <Text color="gray.400" display={["none", "block"]}>
            Create and manage Agents.
          </Text>
        </Stack>
        <NextLink passHref href="/agents/new">
          <Button leftIcon={<Icon as={TbPlus} />} alignSelf="flex-start">
            New agent
          </Button>
        </NextLink>
      </HStack>

      <SimpleGrid columns={[1, 2, 2, 4]} gap={6}>
        {data?.map(({ id, description, llm, hasMemory, name, type }) => (
          <AgentCard
            key={id}
            description={description}
            id={id}
            name={name}
            llm={llm}
            type={type}
            hasMemory={hasMemory}
            onDelete={(id) => handleDelete(id)}
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
