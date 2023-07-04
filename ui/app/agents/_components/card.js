"use client";
import {
  Button,
  HStack,
  Icon,
  Text,
  IconButton,
  useToast,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { TbTrash, TbCopy, TbPlayerPlay } from "react-icons/tb";
import { useAsyncFn } from "react-use";

export default function AgentCard({ id, name, description, onDelete }) {
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
    <Stack borderWidth="1px" borderRadius="md" padding={4}>
      <Text noOfLines={1} as="b">
        {name}
      </Text>
      <Text noOfLines={1} color="gray.500">
        {description}
      </Text>
      <HStack justifyContent="space-between">
        <NextLink passHref href={`/agents/${id}`}>
          <Button
            color="green.500"
            fontFamily="mono"
            size="sm"
            leftIcon={<Icon as={TbPlayerPlay} />}
          >
            RUN
          </Button>
        </NextLink>
        <HStack spacing={0}>
          <HStack>
            <IconButton
              variant="ghost"
              size="sm"
              icon={<Icon fontSize="lg" as={TbCopy} color="gray.500" />}
              onClick={() => copyToClipboard()}
            />
          </HStack>
          <HStack justifyContent="flex-end">
            <IconButton
              size="sm"
              variant="ghost"
              icon={
                isDeleting ? (
                  <Spinner size="sm" />
                ) : (
                  <Icon fontSize="lg" as={TbTrash} color="gray.500" />
                )
              }
              onClick={() => handleDelete(id)}
            />
          </HStack>
        </HStack>
      </HStack>
    </Stack>
  );
}
