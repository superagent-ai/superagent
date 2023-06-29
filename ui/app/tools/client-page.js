"use client";
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
  Td,
  Text,
  useDisclosure,
  IconButton,
  Tag,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { TbPlus, TbTrash } from "react-icons/tb";
import API from "@/lib/api";
import { analytics } from "@/lib/analytics";
import ToolsModal from "./modal";

function ToolRow({ id, name, type, onDelete }) {
  return (
    <Tr>
      <Td>
        <Text noOfLines={1}>{name}</Text>
      </Td>
      <Td>
        <Tag>{type}</Tag>
      </Td>
      <Td textAlign="right">
        <IconButton
          size="sm"
          variant="ghost"
          icon={<Icon fontSize="lg" as={TbTrash} />}
          onClick={() => onDelete(id)}
        />
      </Td>
    </Tr>
  );
}

export default function ToolsClientPage({ data, session }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const router = useRouter();
  const api = new API(session);

  const onSubmit = async (values) => {
    await api.createTool({ ...values });

    analytics.track("Created Tool", { ...values });
    router.refresh();
    onClose();
  };

  const handleDelete = async (id) => {
    await api.deleteTool({ id });

    analytics.track("Deleted Tool", { id });
    router.refresh();
  };

  return (
    <Stack flex={1} paddingX={12} paddingY={12} spacing={6}>
      <HStack justifyContent="space-between">
        <Stack>
          <Heading as="h1" fontSize="2xl">
            Tools
          </Heading>
          <Text color="gray.400">
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
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>&nbsp;</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map(({ id, name, type }) => (
              <ToolRow
                key={id}
                id={id}
                name={name}
                type={type}
                onDelete={(id) => handleDelete(id)}
              />
            ))}
          </Tbody>
        </Table>
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
