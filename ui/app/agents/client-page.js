"use client";
import NextLink from "next/link";
import {
  Button,
  Heading,
  Icon,
  Stack,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Text,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { TbPlus } from "react-icons/tb";
import API from "@/lib/api";
import AgentRow from "./_components/row";
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
    <Stack paddingX={12} paddingY={12} spacing={6} flex={1}>
      <HStack justifyContent="space-between">
        <Stack>
          <Heading as="h1" fontSize="2xl">
            Agents
          </Heading>
          <Text color="gray.400">Create and manage Agents.</Text>
        </Stack>
        <NextLink passHref href="/agents/new">
          <Button leftIcon={<Icon as={TbPlus} />} alignSelf="flex-start">
            New agent
          </Button>
        </NextLink>
      </HStack>

      <Stack spacing={4}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>ID</Th>
              <Th>Model</Th>
              <Th>Memory</Th>
              <Th>&nbsp;</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map(({ id, llm, hasMemory, name, type }) => (
              <AgentRow
                key={id}
                id={id}
                name={name}
                llm={llm}
                type={type}
                hasMemory={hasMemory}
                onDelete={(id) => handleDelete(id)}
              />
            ))}
          </Tbody>
        </Table>
      </Stack>
    </Stack>
  );
}
