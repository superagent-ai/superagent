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
  Select,
  Text,
  useDisclosure,
  FormHelperText,
  FormErrorMessage,
  IconButton,
  useToast,
  Box,
  Tag,
  SimpleGrid,
  Textarea,
} from "@chakra-ui/react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { TbPlus, TbCopy, TbTrash } from "react-icons/tb";
import { useForm } from "react-hook-form";
import API from "@/lib/api";
import { analytics } from "@/lib/analytics";
import { usePsychicLink } from "@psychic-api/link";

function DocumentCard({ id, name, type, url, onDelete }) {
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
    <Stack backgroundColor="whiteAlpha.100" borderRadius="md" padding={4}>
      <Text noOfLines={1} as="b">
        {name}
      </Text>
      <HStack justifyContent="space-between">
        <Tag variant="subtle" colorScheme="green" size="sm">
          {type}
        </Tag>
        <HStack spacing={0}>
          <IconButton
            size="sm"
            variant="ghost"
            icon={<Icon color="gray.500" fontSize="lg" as={TbCopy} />}
            onClick={() => copyToClipboard(id)}
          />
          <IconButton
            size="sm"
            variant="ghost"
            icon={<Icon fontSize="lg" as={TbTrash} color="gray.500" />}
            onClick={() => onDelete(id)}
          />
        </HStack>
      </HStack>
    </Stack>
  );
}

export default function DocumentsClientPage({ data, session }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const router = useRouter();
  const api = new API(session);
  const toast = useToast();
  const {
    formState: { isSubmitting, errors },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm();

  const documentType = watch("type");
  const { open, isReady, isLoading } = usePsychicLink(
    process.env.NEXT_PUBLIC_PSYCHIC_PUBLIC_KEY,
    (newConnection) => {
      api.createDocument({
        name: `Psychic: ${newConnection.connectorId}`,
        type: "PSYCHIC",
        metadata: {
          connectorId: newConnection.connectorId,
        },
      });

      toast({
        description: "Psychic connection created!",
        position: "top",
        colorScheme: "gray",
      });

      onClose();
      router.refresh();
    }
  );
  const shouldShowPsychic = process.env.NEXT_PUBLIC_PSYCHIC_PUBLIC_KEY;

  const onSubmit = async (values) => {
    const { type, name, url, auth_type, auth_key, auth_value } = values;
    const payload = {
      name,
      type,
      url,
      authorization: auth_key && {
        type: auth_type,
        key: auth_key,
        value: auth_value,
      },
    };

    await api.createDocument(payload);

    if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
      analytics.track("Created Document", { ...payload });
    }

    router.refresh();
    reset();
    onClose();
  };

  const handleDelete = async (id) => {
    await api.deleteDocument({ id });

    if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
      analytics.track("Deleted Document", { id });
    }

    router.refresh();
  };

  const onConnectAPI = async () => {
    open(session.user.user.id);
  };

  return (
    <Stack flex={1} paddingX={12} paddingY={12} spacing={6}>
      <HStack justifyContent="space-between" spacing={12}>
        <Stack>
          <Heading as="h1" fontSize="2xl">
            Documents
          </Heading>
          <Text color="gray.400">
            Upload documents and use them to do question answering.
          </Text>
          <Text color="gray.400">
            Superagent will automatically split them into chunks and ingest them
            into a vector database for retrieval.
          </Text>
        </Stack>
        <Button
          leftIcon={<Icon as={TbPlus} />}
          alignSelf="flex-start"
          onClick={onOpen}
        >
          New document
        </Button>
      </HStack>
      <Stack spacing={4}>
        <SimpleGrid columns={[2, 2, 2, 4]} gap={6}>
          {data?.map(({ id, name, type, url }) => (
            <DocumentCard
              key={id}
              id={id}
              name={name}
              url={url}
              type={type}
              onDelete={(id) => handleDelete(id)}
            />
          ))}
        </SimpleGrid>
      </Stack>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>New document</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              {shouldShowPsychic && (
                <HStack
                  backgroundColor="gray.800"
                  borderRadius="md"
                  padding={4}
                  spacing={5}
                  justifyContent="space-between"
                >
                  <HStack spacing={6}>
                    <NextImage
                      src="/psychic-logo.png"
                      alt="Psychic"
                      width="40"
                      height="40"
                    />
                    <Stack spacing={0}>
                      <HStack>
                        <Text as="b">Psychic</Text>{" "}
                        <Tag colorScheme="green" size="sm" borderRadius="full">
                          New
                        </Tag>
                      </HStack>

                      <Text fontSize="sm" noOfLines={1} color="gray.500">
                        Connect to Google Drive, Jira, Zendesk, Dropox etc.
                      </Text>
                    </Stack>
                  </HStack>
                  <Button
                    isDisabled={!isReady}
                    onClick={onConnectAPI}
                    isLoading={isLoading}
                  >
                    Connect
                  </Button>
                </HStack>
              )}
              <Stack>
                <FormControl isRequired isInvalid={errors?.name}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    {...register("name", { required: true })}
                  />
                  <FormHelperText>A document name.</FormHelperText>
                  {errors?.name && (
                    <FormErrorMessage>Invalid name</FormErrorMessage>
                  )}
                </FormControl>
                {documentType === "URL" ? (
                  <FormControl isRequired isInvalid={errors?.url}>
                    <FormLabel>URL</FormLabel>
                    <Textarea
                      placeholder="Comma separated list of urls..."
                      {...register("url", { required: true })}
                    />
                    <FormHelperText>
                      A comma separated list of urls.
                    </FormHelperText>
                    {errors?.url && (
                      <FormErrorMessage>Invalid URL</FormErrorMessage>
                    )}
                  </FormControl>
                ) : (
                  <FormControl isRequired isInvalid={errors?.url}>
                    <FormLabel>URL</FormLabel>
                    <Input
                      type="text"
                      {...register("url", { required: true })}
                    />
                    <FormHelperText>
                      A publicly accessible URL to your document.
                    </FormHelperText>
                    {errors?.url && (
                      <FormErrorMessage>Invalid URL</FormErrorMessage>
                    )}
                  </FormControl>
                )}

                <FormControl isRequired isInvalid={errors?.type}>
                  <FormLabel>Type</FormLabel>
                  <Select {...register("type", { required: true })}>
                    <option value="PDF">PDF</option>
                    <option value="CSV">CSV</option>
                    <option value="TXT">TXT</option>
                    <option value="URL">URL</option>
                    <option value="YOUTUBE">Youtube</option>
                    <option value="MARKDOWN">Markdown</option>
                  </Select>
                  {errors?.type && (
                    <FormErrorMessage>Invalid type</FormErrorMessage>
                  )}
                </FormControl>
                {documentType === "OPENAPI" && (
                  <FormControl>
                    <Alert variant="solid" colorScheme="red">
                      This feature is exeperimental, use with caution.
                    </Alert>
                    <Stack marginTop={4}>
                      <FormLabel>Authorization</FormLabel>
                      <HStack>
                        <Select {...register("auth_type")}>
                          <option value="header">Header</option>
                          <option value="query">Query params</option>
                        </Select>
                        <Input
                          placeholder="Header or query param key"
                          type="text"
                          {...register("auth_key")}
                        />
                      </HStack>
                      <Box>
                        <Input
                          placeholder="Header or query param value"
                          type="text"
                          {...register("auth_value")}
                        />
                        <FormHelperText>
                          If the OpenApi spec your are using requires
                          authentication you need to use the fields above.
                        </FormHelperText>
                      </Box>
                    </Stack>
                  </FormControl>
                )}
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
