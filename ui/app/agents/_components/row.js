"use client";
import {
  Button,
  HStack,
  Icon,
  Tag,
  Tr,
  Td,
  Text,
  IconButton,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { TbTrash, TbCopy, TbPlayerPlay } from "react-icons/tb";
import { useAsyncFn } from "react-use";
import titleize from "titleize";

export default function AgentRow({ id, name, llm, type, hasMemory, onDelete }) {
  const toast = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(id);

    toast({
      description: "Copied to clipboard",
      position: "top",
      colorScheme: "gray",
    });
  };

  const [{ loading: isDeleting }, handleDelete] = useAsyncFn(
    async (id) => {
      await onDelete(id);

      toast({
        description: "Agent deleted",
        position: "top",
        colorScheme: "gray",
      });
    },
    [onDelete]
  );

  return (
    <Tr>
      <Td>
        <Text noOfLines={1}>{name}</Text>
      </Td>
      <Td>
        <HStack>
          <Text noOfLines={1}>{id}</Text>
          <IconButton
            size="sm"
            icon={<Icon color="orange.500" fontSize="lg" as={TbCopy} />}
            onClick={() => copyToClipboard()}
          />
        </HStack>
      </Td>
      <Td>
        <Tag>{llm.model || titleize(llm.provider)}</Tag>
      </Td>
      <Td>
        <Tag colorScheme={hasMemory ? "green" : "red"} variant="subtle">
          {hasMemory ? "True" : "False"}
        </Tag>
      </Td>
      <Td textAlign="right">
        <HStack justifyContent="flex-end">
          <NextLink passHref href={`/agents/${id}`}>
            <Button
              fontFamily="mono"
              size="sm"
              leftIcon={<Icon as={TbPlayerPlay} />}
            >
              RUN
            </Button>
          </NextLink>
          <IconButton
            size="sm"
            variant="ghost"
            icon={
              isDeleting ? (
                <Spinner size="sm" />
              ) : (
                <Icon fontSize="lg" as={TbTrash} />
              )
            }
            onClick={() => handleDelete(id)}
          />
        </HStack>
      </Td>
    </Tr>
  );
}
