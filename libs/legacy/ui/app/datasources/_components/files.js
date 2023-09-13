"use client";
import { useCallback, useState } from "react";
import SearchBar from "@/app/_components/search-bar";
import { useRouter } from "next/navigation";
import {
  Button,
  Code,
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
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { TbCopy, TbTrash, TbPencil } from "react-icons/tb";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAsyncFn } from "react-use";
import API from "@/lib/api";
import UploadButton from "./upload-button";
import {
  ACCEPTABLE_STATIC_FILE_TYPES,
  getFileType,
  uploadFile,
} from "@/lib/datasources";

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

export default function Files({ data, session }) {
  const [filteredData, setData] = useState();
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
    setValue,
  } = useForm();
  const onCancel = async () => {
    reset();
    setSelectedDocument();
    onClose();
  };

  const onUpdate = async (values) => {
    const { name, description } = values;
    const payload = {
      name,
      description,
    };

    await api.patchDocument(selectedDocument, payload);

    if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
      analytics.track("Updated Document", { ...payload });
    }

    toast({
      description: "Document updated",
      position: "top",
      colorScheme: "gray",
    });

    setData();
    router.refresh();
    reset();
    setSelectedDocument();
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

  const handleEdit = async (documentId) => {
    const document = data.find(({ id }) => id === documentId);

    setSelectedDocument(documentId);
    setValue("name", document?.name);
    setValue("description", document?.description);
    onOpen();
  };

  const onUpload = useCallback(async (file) => {
    const type = getFileType(file.type);
    const { Location } = await uploadFile(file);
    const payload = {
      name: file.name,
      description: `Useful for answering questions about ${file.name}`,
      type,
      url: Location,
    };

    await api.createDocument(payload);

    if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
      analytics.track("Created Document", { ...payload });
    }

    toast({
      description: "Document created",
      position: "top",
      colorScheme: "gray",
    });

    router.refresh();
  }, []);

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
          <UploadButton
            label="Upload file"
            accept=".pdf, .csv, .txt, .md, text/plain, application/pdf, text/csv"
            onSelect={onUpload}
          />
          <Text color="gray.500" fontSize="sm">
            We currently support <Code>.txt</Code>, <Code>.pdf</Code>,{" "}
            <Code>.csv</Code> and <Code>.md</Code> files
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
                      ACCEPTABLE_STATIC_FILE_TYPES.includes(type)
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
                      ACCEPTABLE_STATIC_FILE_TYPES.includes(type)
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
        <ModalContent as="form" onSubmit={handleSubmit(onUpdate)}>
          <ModalHeader>Update document</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Stack>
                <FormControl isRequired isInvalid={errors?.name}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    placeholder="My document"
                    type="text"
                    {...register("name", { required: true })}
                  />
                  <FormHelperText>A document name.</FormHelperText>
                  {errors?.name && (
                    <FormErrorMessage>Invalid name</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isRequired isInvalid={errors?.description}>
                  <FormLabel>Description</FormLabel>
                  <Input
                    type="text"
                    placeholder="Useful for finding information about..."
                    {...register("description", { required: true })}
                  />
                  <FormHelperText>
                    What is this document useful for?
                  </FormHelperText>
                  {errors?.description && (
                    <FormErrorMessage>Invalid description</FormErrorMessage>
                  )}
                </FormControl>
              </Stack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={onCancel}
              isDisabled={isCreatingDocument}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting || isCreatingDocument}
              isDisabled={isCreatingDocument}
            >
              {selectedDocument ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}
