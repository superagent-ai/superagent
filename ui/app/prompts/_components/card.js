"use client";
import { HStack, Icon, IconButton, Stack, Text } from "@chakra-ui/react";
import { TbTrash, TbPencil } from "react-icons/tb";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function PromptCard({
  id,
  name,
  createdAt,
  template,
  onDelete,
  onEdit,
}) {
  return (
    <Stack borderWidth="1px" borderRadius="md" padding={4}>
      <HStack justifyContent="space-between" flex={1}>
        <Text noOfLines={1} as="b" flex={1}>
          {name}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {dayjs(createdAt).fromNow()}
        </Text>
      </HStack>
      <Text fontSize="sm" color="gray.500">
        {`Id: ${id}`}
      </Text>
      <Text noOfLines={2} color="gray.500">
        {template}
      </Text>
      <HStack justifyContent="flex-end" spacing={0}>
        <IconButton
          size="sm"
          variant="ghost"
          icon={<Icon fontSize="lg" as={TbPencil} color="gray.500" />}
          onClick={() => onEdit(id)}
        />
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
