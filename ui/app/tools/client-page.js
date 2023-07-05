"use client";
import {
  Button,
  Heading,
  Icon,
  Stack,
  Text,
  useDisclosure,
  IconButton,
  Tag,
  SimpleGrid,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { TbPlus, TbTrash } from "react-icons/tb";
import API from "@/lib/api";
import { analytics } from "@/lib/analytics";
import ToolsModal from "./modal";

function ToolCard({ id, name, type, onDelete }) {
  return (
    <Stack borderWidth="1px" borderRadius="md" padding={4}>
      <Text noOfLines={1} as="b">
        {name}
      </Text>
      <HStack justifyContent="space-between">
        <Tag variant="subtle" colorScheme="green" size="sm">
          {type}
        </Tag>
        <IconButton
          size="sm"
          variant="ghost"
          icon={<Icon fontSize="lg" as={TbTrash} color="gray.500" />}
          onClick={() => onDelete(id)}
        />
      </HStack>
    </Stack>
  );
}

export default function ToolsClientPage({ data, session }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const router = useRouter();
  const api = new API(session);

  const onSubmit = async (values) => {
    await api.createTool({ ...values });

    if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
      analytics.track("Created Tool", { ...values });
    }

    router.refresh();
    onClose();
  };

  const handleDelete = async (id) => {
    await api.deleteTool({ id });

    if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
      analytics.track("Deleted Tool", { id });
    }

    router.refresh();
  };

  return (
    <Stack
      flex={1}
      paddingX={[6, 12]}
      paddingY={12}
      spacing={6}
      overflow="auto"
    >
      <HStack justifyContent="space-between">
        <Stack>
          <Heading as="h1" fontSize="2xl">
            Tools
          </Heading>
          <Text color="gray.400" display={["none", "block"]}>
            Create instances of specific tools to use with your Agents.
          </Text>
        </Stack>
        <Button
          leftIcon={<Icon as={TbPlus} />}
          alignSelf="flex-start"
          onClick={onOpen}
        >
          New tool
        </Button>
      </HStack>
      <Stack spacing={4}>
        <SimpleGrid columns={[1, 2, 2, 4]} gap={6}>
          {data?.map(({ id, name, type }) => (
            <ToolCard
              key={id}
              id={id}
              name={name}
              type={type}
              onDelete={(id) => handleDelete(id)}
            />
          ))}
        </SimpleGrid>
      </Stack>
      <ToolsModal
        onSubmit={onSubmit}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
      />
    </Stack>
  );
}
