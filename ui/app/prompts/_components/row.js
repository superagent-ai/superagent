import { HStack, Icon, IconButton, Tag, Td, Tr } from "@chakra-ui/react";
import { TbTrash, TbEdit } from "react-icons/tb";

export default function PromptRow({
  id,
  name,
  inputVariables,
  onDelete,
  onEdit,
}) {
  return (
    <Tr>
      <Td>{name}</Td>
      <Td>
        <HStack>
          {inputVariables?.map((variable) => (
            <Tag key={variable}>{variable}</Tag>
          ))}
        </HStack>
      </Td>
      <Td textAlign="right">
        <HStack justifyContent="flex-end">
          <IconButton
            size="sm"
            variant="ghost"
            icon={<Icon fontSize="lg" as={TbEdit} />}
            onClick={() => onEdit(id)}
          />
          <IconButton
            size="sm"
            variant="ghost"
            icon={<Icon fontSize="lg" as={TbTrash} />}
            onClick={() => onDelete(id)}
          />
        </HStack>
      </Td>
    </Tr>
  );
}
