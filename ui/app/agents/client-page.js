"use client";
import { useState } from "react";
import NextLink from "next/link";
import {
  Button,
  Heading,
  Icon,
  Stack,
  Text,
  HStack,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { TbPlus } from "react-icons/tb";
import API from "@/lib/api";
import AgentCard from "./_components/card";
import { analytics } from "@/lib/analytics";
import SearchBar from "../_components/search-bar";
import FilterBar from "../_components/filter-bar";

export default function AgentsClientPage({ data, tags, session }) {
  const [filteredData, setData] = useState();
  const router = useRouter();
  const api = new API(session);

  const handleDelete = async (id) => {
    await api.deleteAgent({ id });

    if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
      analytics.track("Deleted Agent", { id });
    }

    setData();
    router.refresh();
  };

  const handleSearch = ({ searchTerm }) => {
    if (!searchTerm) {
      setData(data);
    }

    const keysToFilter = ["name"];
    const filteredItems = data.filter((item) =>
      keysToFilter.some((key) =>
        item[key].toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setData(filteredItems);
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
      <SearchBar
        onSearch={(values) => handleSearch(values)}
        onReset={() => setData(data)}
      />
      <FilterBar
        items={filteredData || data}
        filters={tags}
        onFilter={(values) => setData(values)}
      />
      <SimpleGrid columns={[1, 2, 2, 4]} gap={6}>
        {filteredData
          ? filteredData?.map(
              ({ id, description, llm, createdAt, hasMemory, name, type }) => (
                <AgentCard
                  key={id}
                  createdAt={createdAt}
                  description={description}
                  id={id}
                  name={name}
                  llm={llm}
                  type={type}
                  hasMemory={hasMemory}
                  onDelete={(id) => handleDelete(id)}
                />
              )
            )
          : data?.map(
              ({ id, description, llm, createdAt, hasMemory, name, type }) => (
                <AgentCard
                  key={id}
                  createdAt={createdAt}
                  description={description}
                  id={id}
                  name={name}
                  llm={llm}
                  type={type}
                  hasMemory={hasMemory}
                  onDelete={(id) => handleDelete(id)}
                />
              )
            )}
      </SimpleGrid>
    </Stack>
  );
}
