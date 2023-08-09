"use client";
import { useCallback, useState } from "react";
import SearchBar from "@/app/_components/search-bar";
import { useRouter } from "next/navigation";
import {
  Button,
  Code,
  Card,
  CardHeader,
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
  ModalFooter,
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
  const [selectedSource, setSelectedSource] = useState();
  const [isCreatingDocument, setIsCreatingDocument] = useState();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedDocument, setSelectedDocument] = useState();
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
  const url = watch("url");

  const onCancel = async () => {
    reset();
    setSelectedDocument();
    setSelectedSource();
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
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            {selectedSource?.name || "Connect application"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedSource ? (
              <Stack spacing={10} paddingBottom={5}>
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
                      Use this to instruct the Agent when to query this source.
                    </FormHelperText>
                  </FormControl>
                  {selectedSource.inputs.map(
                    ({ key, name, type, required, options, helpText }) => (
                      <FormControl key={key} isRequired={required}>
                        <FormLabel>{name}</FormLabel>
                        {type === "input" && (
                          <Input type="text" {...register(key, { required })} />
                        )}
                        {type === "date" && (
                          <Input type="date" {...register(key, { required })} />
                        )}
                        {type === "select" && <Select></Select>}
                        {helpText && (
                          <FormHelperText>{helpText}</FormHelperText>
                        )}
                      </FormControl>
                    )
                  )}
                </Stack>
              </Stack>
            ) : (
              <Stack spacing={10} paddingBottom={5}>
                <SearchBar />
                <SimpleGrid columns={3} gridGap={4}>
                  {APPLICATIONS.map(({ name, logo, id }) => (
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
                          width="100%"
                          leftIcon={<Icon as={TbPlus} />}
                          onClick={() =>
                            setSelectedSource(
                              APPLICATIONS.find(({ id: appId }) => appId === id)
                            )
                          }
                        >
                          Add
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </SimpleGrid>
              </Stack>
            )}
          </ModalBody>
          {selectedSource && (
            <ModalFooter>
              <Button
                variant="ghost"
                mr={3}
                onClick={() => setSelectedSource()}
                isDisabled={isCreatingDocument}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting || isCreatingDocument}
                isDisabled={isCreatingDocument}
              >
                Create
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </Stack>
  );
}
