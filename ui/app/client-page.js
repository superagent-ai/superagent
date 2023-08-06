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
  Avatar,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { TbPlayerPlay } from "react-icons/tb";
import relativeTime from "dayjs/plugin/relativeTime";
import SearchBar from "./_components/search-bar";

dayjs.extend(relativeTime);

function LibraryCard({
  id,
  shareableToken,
  name,
  description,
  createdAt,
  avatarUrl,
}) {
  return (
    <Stack borderWidth="1px" borderRadius="md" padding={4} spacing={4}>
      <Stack>
        <HStack justifyContent="space-between" flex={1}>
          <HStack spacing={4}>
            <Avatar size="sm" src={avatarUrl || "./logo.png"} />
            <Text noOfLines={1} as="b" flex={1}>
              {name}
            </Text>
          </HStack>
          <Text fontSize="sm" color="gray.500">
            {dayjs(createdAt).fromNow()}
          </Text>
        </HStack>
        <Text fontSize="sm" noOfLines={2} color="gray.500">
          {description || "No description"}
        </Text>
      </Stack>
      <HStack justifyContent="space-between">
        <NextLink
          passHref
          href={`https://app.superagent.sh/share?agentId=${id}&token=${shareableToken}`}
        >
          <Button
            color="green.500"
            fontFamily="mono"
            size="sm"
            leftIcon={<Icon as={TbPlayerPlay} />}
          >
            RUN
          </Button>
        </NextLink>
      </HStack>
    </Stack>
  );
}

export default function HomeClientPage({ data }) {
  const [filteredData, setData] = useState();

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
            Library
          </Heading>
          <Text color="gray.400" display={["none", "block"]}>
            Browse agents made by others
          </Text>
        </Stack>
      </HStack>
      <SearchBar
        onSearch={(values) => handleSearch(values)}
        onReset={() => setData(data)}
      />
      <SimpleGrid columns={[1, 2, 2, 4]} gap={6}>
        {filteredData
          ? filteredData?.map(
              ({
                id,
                avatarUrl,
                description,
                llm,
                createdAt,
                hasMemory,
                name,
                type,
                shareableToken,
              }) => (
                <LibraryCard
                  shareableToken={shareableToken}
                  avatarUrl={avatarUrl}
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
              ({
                id,
                avatarUrl,
                description,
                llm,
                createdAt,
                hasMemory,
                name,
                type,
                shareableToken,
              }) => (
                <LibraryCard
                  avatarUrl={avatarUrl}
                  shareableToken={shareableToken}
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
