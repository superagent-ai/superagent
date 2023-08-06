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
import dayjs from "dayjs";
import NextLink from "next/link";
import { TbTrash, TbCopy, TbPlayerPlay } from "react-icons/tb";
import { useAsyncFn } from "react-use";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function AgentCard({ id, name, createdAt, onDelete }) {
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
    <Stack borderWidth="1px" borderRadius="md" padding={4} spacing={4}>
      <Stack>
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
      </Stack>
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
