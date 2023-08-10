"use client";
import { useCallback, useState } from "react";
import SearchBar from "@/app/_components/search-bar";
import { useRouter } from "next/navigation";
import {
  Button,
  Box,
  Card,
  CardBody,
  CardFooter,
  HStack,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Spinner,
  Icon,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  Stack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  useToast,
  useDisclosure,
  Tag,
  SimpleGrid,
  Avatar,
  Select,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { TbCopy, TbPlus, TbTrash, TbPencil } from "react-icons/tb";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAsyncFn } from "react-use";
import API from "@/lib/api";
import { APPLICATIONS, ACCEPTABLE_APPLICATION_TYPES } from "@/lib/datasources";

dayjs.extend(relativeTime);

function DocumentRow({ id, name, createdAt, type, onDelete, onEdit }) {
  const toast = useToast();
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);

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
        description: "Document deleted",
        position: "top",
        colorScheme: "gray",
      });
    },
    [onDelete]
  );

  return (
    <Tr>
      <Td paddingLeft={0}>
        <Text noOfLines={1} flex={1} fontWeight="bold">
          {name}
        </Text>
      </Td>
      <Td>
        <Tag variant="subtle" colorScheme="green" size="sm">
          {type}
        </Tag>
      </Td>
      <Td>
        <HStack>
          <Text color="gray.500">{id}</Text>
          <IconButton
            size="sm"
            variant="ghost"
            icon={<Icon color="gray.500" fontSize="lg" as={TbCopy} />}
            onClick={() => copyToClipboard(id)}
          />
        </HStack>
      </Td>
      <Td>
        <Text color="gray.500">{dayjs(createdAt).fromNow()}</Text>
      </Td>
      <Td paddingRight={0}>
        <HStack spacing={0} justifyContent="flex-end">
          <IconButton
            size="sm"
            variant="ghost"
            icon={<Icon fontSize="lg" as={TbPencil} color="gray.500" />}
            onClick={() => onEdit(id)}
          />

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
      </Td>
    </Tr>
  );
}

export default function Applications({ data, session }) {
  const [filteredData, setData] = useState();
  const [filteredAppData, setAppData] = useState();
  const [selectedSource, setSelectedSource] = useState();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedDocument, setSelectedDocument] = useState();
  const router = useRouter();
  const api = new API(session);
  const toast = useToast();
  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm();
  const url = watch("url");

  const onCancel = async () => {
    reset();
    setSelectedDocument();
    setSelectedSource();
    setAppData();
    onClose();
  };

  const handleSearch = ({ searchTerm }) => {
    if (!searchTerm) {
      setData(data);
    }

    const keysToFilter = ["name", "type"];
    const filteredItems = data.filter((item) =>
      keysToFilter.some((key) =>
        item[key].toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setData(filteredItems);
  };

  const handleAppSearch = ({ searchTerm }) => {
    if (searchTerm.length < 3) {
      setAppData(APPLICATIONS);
      return;
    }

    const keysToFilter = ["name"];
    const filteredItems = APPLICATIONS.filter((item) =>
      keysToFilter.some((key) =>
        item[key].toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setAppData(filteredItems);
  };

  const handleDelete = async (id) => {
    await api.deleteDocument({ id });

    if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
      analytics.track("Deleted Document", { id });
    }

    setData();
    router.refresh();
  };

  const onSubmit = useCallback(
    async (values) => {
      const { name, description, url, ...metadata } = values;
      const payload = {
        name: name,
        description,
        url,
        type: selectedSource.id,
        metadata,
      };

      await api.createDocument(payload);

      if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
        analytics.track("Connected application", { ...payload });
      }

      toast({
        description: "Application connected",
        position: "top",
        colorScheme: "gray",
      });

      onCancel();

      router.refresh();
    },
    [selectedSource, router, onCancel]
  );

  const handleEdit = async (documentId) => {
    const document = data.find(({ id }) => id === documentId);
    const selectedSource = APPLICATIONS.find(({ id }) => id === document.type);

    setSelectedDocument(documentId);
    setSelectedSource(selectedSource);
    setValue("name", document?.name);
    setValue("description", document?.description);
    onOpen();
  };

  const onUpdate = async (values) => {
    const { name, description } = values;
    const payload = {
      name,
      description,
    };

    await api.patchDocument(selectedDocument, payload);

    if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
      analytics.track("Updated Application", { ...payload });
    }

    toast({
      description: "Application updated",
      position: "top",
      colorScheme: "gray",
    });

    setData();
    router.refresh();
    reset();
    setSelectedDocument();
    onCancel();
  };

  return (
    <Stack spacing={12} marginTop={10}>
      <Stack
        borderWidth="2px"
        borderRadius="md"
        borderStyle="dashed"
        alignItems="center"
        justifyContent="center"
        padding={8}
        spacing={6}
      >
        <Stack alignItems="center" justifyContent="center" spacing={4}>
          <Button leftIcon={<Icon as={TbPlus} />} onClick={onOpen}>
            Add application
          </Button>
          <Text color="gray.500" fontSize="sm">
            Import data from Intercom, Hubspot, Zendesk, Jira, Notion and many
            more...
          </Text>
        </Stack>
      </Stack>
      <Stack spacing={4}>
        <SearchBar
          onSearch={(values) => handleSearch(values)}
          onReset={() => setData(data)}
        />
        <TableContainer>
          <Table variant="simple" fontSize="md">
            <Thead>
              <Tr>
                <Th paddingLeft={0}>Name</Th>
                <Th>Type</Th>
                <Th>ID</Th>
                <Th>Created at</Th>
                <Th>&nbsp;</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredData
                ? filteredData
                    ?.filter(({ type }) =>
                      ACCEPTABLE_APPLICATION_TYPES.includes(type)
                    )
                    .map(({ id, name, createdAt, type, url }) => (
                      <DocumentRow
                        key={id}
                        id={id}
                        createdAt={createdAt}
                        name={name}
                        url={url}
                        type={type}
                        onDelete={(id) => handleDelete(id)}
                        onEdit={(id) => handleEdit(id)}
                      />
                    ))
                : data
                    ?.filter(({ type }) =>
                      ACCEPTABLE_APPLICATION_TYPES.includes(type)
                    )
                    .map(({ id, name, createdAt, type, url }) => (
                      <DocumentRow
                        key={id}
                        id={id}
                        createdAt={createdAt}
                        name={name}
                        url={url}
                        type={type}
                        onDelete={(id) => handleDelete(id)}
                        onEdit={(id) => handleEdit(id)}
                      />
                    ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
      <Modal isOpen={isOpen} onClose={onCancel} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedSource?.name || "Connect application"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box position="relative">
              {selectedSource ? (
                <Stack
                  spacing={10}
                  paddingBottom={5}
                  as="form"
                  onSubmit={handleSubmit(
                    selectedDocument ? onUpdate : onSubmit
                  )}
                >
                  <Stack>
                    <FormControl isRequired={true}>
                      <FormLabel>Name</FormLabel>
                      <Input
                        type="text"
                        placeholder="E.g my integration"
                        {...register("name", { required: true })}
                      />
                    </FormControl>
                    <FormControl isRequired={true}>
                      <FormLabel>Description</FormLabel>
                      <Input
                        type="text"
                        placeholder="Useful for answering questions about..."
                        {...register("description", { required: true })}
                      />
                      <FormHelperText>
                        Use this to instruct the Agent when to query this
                        source.
                      </FormHelperText>
                    </FormControl>
                    {!selectedDocument &&
                      selectedSource.inputs.map(
                        ({ key, name, type, required, options, helpText }) => (
                          <FormControl key={key} isRequired={required}>
                            <FormLabel>{name}</FormLabel>
                            {type === "input" && (
                              <Input
                                type="text"
                                {...register(key, { required })}
                              />
                            )}
                            {type === "date" && (
                              <Input
                                type="date"
                                {...register(key, { required })}
                              />
                            )}
                            {type === "select" && <Select></Select>}
                            {helpText && (
                              <FormHelperText>{helpText}</FormHelperText>
                            )}
                          </FormControl>
                        )
                      )}
                  </Stack>
                  {selectedSource && (
                    <HStack
                      alignItems="flex-end"
                      justifyContent="flex-end"
                      spacing={0}
                    >
                      <Button
                        variant="ghost"
                        mr={3}
                        onClick={() => setSelectedSource()}
                        isDisabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        isLoading={isSubmitting}
                        isDisabled={isSubmitting}
                      >
                        {selectedDocument ? "Update" : "Connect"}
                      </Button>
                    </HStack>
                  )}
                </Stack>
              ) : (
                <Stack spacing={10} paddingBottom={5}>
                  <SearchBar onSearch={(values) => handleAppSearch(values)} />
                  <SimpleGrid
                    columns={3}
                    gridGap={4}
                    maxHeight="400px"
                    overflow="auto"
                  >
                    {filteredAppData
                      ? filteredAppData.map(({ name, logo, id, is_live }) => (
                          <Card key={id} spacing={0}>
                            <CardBody>
                              <Stack
                                alignItems="center"
                                justifyContent="center"
                                spacing={4}
                              >
                                <Avatar src={logo} borderRadius="md" />
                                <Text fontSize="md">{name}</Text>
                              </Stack>
                            </CardBody>
                            <CardFooter paddingTop={0}>
                              <Button
                                isDisabled={!is_live}
                                width="100%"
                                leftIcon={is_live && <Icon as={TbPlus} />}
                                onClick={() =>
                                  setSelectedSource(
                                    APPLICATIONS.find(
                                      ({ id: appId }) => appId === id
                                    )
                                  )
                                }
                              >
                                {is_live ? "Add" : "Coming soon"}
                              </Button>
                            </CardFooter>
                          </Card>
                        ))
                      : APPLICATIONS.map(({ name, logo, id, is_live }) => (
                          <Card key={id} spacing={0}>
                            <CardBody>
                              <Stack
                                alignItems="center"
                                justifyContent="center"
                                spacing={4}
                              >
                                <Avatar src={logo} borderRadius="md" />
                                <Text fontSize="md">{name}</Text>
                              </Stack>
                            </CardBody>
                            <CardFooter paddingTop={0}>
                              <Button
                                isDisabled={!is_live}
                                width="100%"
                                leftIcon={is_live && <Icon as={TbPlus} />}
                                onClick={() =>
                                  setSelectedSource(
                                    APPLICATIONS.find(
                                      ({ id: appId }) => appId === id
                                    )
                                  )
                                }
                              >
                                {is_live ? "Add" : "Coming soon"}
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                  </SimpleGrid>
                </Stack>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Stack>
  );
}
