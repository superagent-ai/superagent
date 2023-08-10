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
  Alert,
  AlertTitle,
  AlertDescription,
  Checkbox,
  Textarea,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { TbCopy, TbPlus, TbTrash, TbPencil } from "react-icons/tb";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAsyncFn } from "react-use";
import API from "@/lib/api";
import { ACCEPTABLE_WEBPAGE_TYPES, isSitemapUrl } from "@/lib/datasources";

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

export default function Webpages({ data, session }) {
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
    watch,
  } = useForm();
  const url = watch("url");

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
    setValue("url", document?.url);
    onOpen();
  };

  const onSubmit = useCallback(async (values) => {
    const { name, description, url, include_subpages, ...metadata } = values;
    const type = isSitemapUrl(url) ? "SITEMAP" : "URL";
    const payload = {
      name: name,
      description,
      url,
      type,
      metadata,
    };

    await api.createDocument(payload);

    if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
      analytics.track("Created Webpage", { ...payload });
    }

    toast({
      description: "Webpage created",
      position: "top",
      colorScheme: "gray",
    });

    onCancel();

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
          <Button leftIcon={<Icon as={TbPlus} />} onClick={onOpen}>
            Add webpage
          </Button>
          <Text color="gray.500" fontSize="sm">
            Add any webpage
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
                      ACCEPTABLE_WEBPAGE_TYPES.includes(type)
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
                      ACCEPTABLE_WEBPAGE_TYPES.includes(type)
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
        <ModalContent
          as="form"
          onSubmit={handleSubmit(selectedDocument ? onUpdate : onSubmit)}
        >
          <ModalHeader>
            {selectedDocument ? "Update webpage" : "Add webpage"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              {isSitemapUrl(url) && (
                <Alert fontSize="md" flexDirection="column" alignItems="left">
                  <HStack>
                    <AlertTitle>
                      Looks like you are trying to import a Sitemap?
                    </AlertTitle>
                  </HStack>
                  <AlertDescription>
                    You can choose to filter out which urls you using the{" "}
                    <Code>Filter URLs</Code> field. This is recommended since
                    Sitemaps can be very large and take a long time to ingest.
                  </AlertDescription>
                </Alert>
              )}
              <Stack>
                <FormControl isRequired isInvalid={errors?.name}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    placeholder="Airbnb"
                    type="text"
                    {...register("name", { required: true })}
                  />
                  <FormHelperText>The name of the webpage.</FormHelperText>
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
                <FormControl isRequired isInvalid={errors?.url}>
                  <FormLabel>URL</FormLabel>
                  <Input
                    type="text"
                    isDisabled={selectedDocument}
                    placeholder="airbnb.com"
                    {...register("url", { required: true })}
                  />
                  <FormHelperText>Add the webpage URL</FormHelperText>
                  {errors?.url && (
                    <FormErrorMessage>Invalid URL</FormErrorMessage>
                  )}
                </FormControl>
                {isSitemapUrl(url) && (
                  <FormControl>
                    <FormLabel>Filter URLs</FormLabel>
                    <Textarea
                      isDisabled={selectedDocument}
                      type="text"
                      placeholder="https://mysite.com/, https://myblog.com/my-post"
                      {...register("filter_urls")}
                    />
                    <FormHelperText>
                      Comma separated list of urls to ingest
                    </FormHelperText>
                  </FormControl>
                )}
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
