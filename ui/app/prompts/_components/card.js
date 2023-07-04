import { HStack, Icon, IconButton, Stack, Text } from "@chakra-ui/react";
import { TbTrash, TbPencil } from "react-icons/tb";

export default function PromptCard({ id, name, template, onDelete, onEdit }) {
  return (
    <Stack borderWidth="1px" borderRadius="md" padding={4}>
      <Text noOfLines={1} as="b">
        {name}
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
