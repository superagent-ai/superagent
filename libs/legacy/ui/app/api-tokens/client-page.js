"use client";
import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  Text,
  SimpleGrid,
  useDisclosure,
  FormHelperText,
  FormErrorMessage,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { TbPlus, TbCopy, TbInfoCircle, TbTrash } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { analytics } from "@/lib/analytics";
import API from "@/lib/api";
import SearchBar from "../_components/search-bar";
import { useState } from "react";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function TokenCard({ id, description, createdAt, token, onDelete }) {
  const toast = useToast();
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);

    toast({
      description: "Copied to clipboard",
      position: "top",
      colorScheme: "gray",
    });
  };

  return (
    <Stack borderWidth="1px" borderRadius="md" padding={4}>
      <HStack justifyContent="space-between">
        <Text noOfLines={1} as="b">
          {description}
        </Text>
      </HStack>
      <Text noOfLines={1} color="gray.500">
        {token}
      </Text>
      <HStack spacing={0} alignSelf="flex-end">
        <IconButton
          size="sm"
          variant="ghost"
          icon={<Icon fontSize="lg" as={TbCopy} color="gray.500" />}
          onClick={() => copyToClipboard(token)}
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

export default function ApiTokensClientPage({ data, session }) {
  const [filteredData, setData] = useState();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const router = useRouter();
  const toast = useToast();
  const api = new API(session);
  const {
    formState: { isSubmitting, errors },
    handleSubmit,
    register,
    reset,
  } = useForm();

  const onSubmit = async (values) => {
    await api.createApiToken(values);

    if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
      analytics.track("Created API Token");
    }

    toast({
      description: "Api token created",
      position: "top",
      colorScheme: "gray",
    });

    setData();
    router.refresh();
    reset();
    onClose();
  };

  const handleDelete = async (id) => {
    await api.deleteApiToken({ id });

    if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
      analytics.track("Deleted API Token");
    }

    toast({
      description: "Api token deleted",
      position: "top",
      colorScheme: "gray",
    });

    setData();
    router.refresh();
  };

  const handleSearch = ({ searchTerm }) => {
    if (!searchTerm) {
      setData(data);
    }

    const keysToFilter = ["description"];
    const filteredItems = data.filter((item) =>
      keysToFilter.some((key) =>
        item[key].toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setData(filteredItems);
  };

  return (
    <Stack paddingX={[6, 12]} paddingY={12} spacing={6} flex={1}>
      <HStack justifyContent="space-between">
        <Stack flex={1}>
          <Heading as="h1" fontSize="2xl">
            Api tokens
          </Heading>
          <Text color="gray.400" display={["none", "block"]}>
            Your secret API keys are listed below.
          </Text>
        </Stack>
        <Button
          leftIcon={<Icon as={TbPlus} />}
          alignSelf="flex-start"
          onClick={onOpen}
        >
          New token
        </Button>
      </HStack>
      <SearchBar
        onSearch={(values) => handleSearch(values)}
        onReset={() => setData(data)}
      />
      <Stack spacing={4}>
        <SimpleGrid columns={[1, 2, 2, 4]} gap={6}>
          {filteredData
            ? filteredData?.map(({ description, createdAt, id, token }) => (
                <TokenCard
                  key={id}
                  createdAt={createdAt}
                  id={id}
                  description={description}
                  token={token}
                  onDelete={(id) => handleDelete(id)}
                />
              ))
            : data?.map(({ description, createdAt, id, token }) => (
                <TokenCard
                  key={id}
                  createdAt={createdAt}
                  id={id}
                  description={description}
                  token={token}
                  onDelete={(id) => handleDelete(id)}
                />
              ))}
        </SimpleGrid>
      </Stack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>New api token</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Alert variant="subtle">
                <HStack alignItems="flex-start">
                  <Icon as={TbInfoCircle} marginTop={1} />
                  <Text>Remember to not share your Api token with anyone.</Text>
                </HStack>
              </Alert>
              <Stack>
                <FormControl isRequired isInvalid={errors?.description}>
                  <FormLabel>Description</FormLabel>
                  <Input
                    type="text"
                    {...register("description", { required: true })}
                  />
                  <FormHelperText>
                    A description for future reference
                  </FormHelperText>
                  {errors?.description && (
                    <FormErrorMessage>Invalid description</FormErrorMessage>
                  )}
                </FormControl>
              </Stack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}
