"use client";
import { useState } from "react";
import {
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
  Text,
  useDisclosure,
  FormHelperText,
  FormErrorMessage,
  IconButton,
  useToast,
  Tag,
  SimpleGrid,
  Center,
  Spinner,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { TbPlus, TbCopy, TbTrash } from "react-icons/tb";
import { useForm } from "react-hook-form";
import API from "@/lib/api";
import { analytics } from "@/lib/analytics";
import SearchBar from "../_components/search-bar";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function TagCard({ id, name, createdAt, color, onDelete }) {
  const toast = useToast();
  const copyToClipboard = () => {
    navigator.clipboard.writeText(name);

    toast({
      description: "Copied to clipboard",
      position: "top",
      colorScheme: "gray",
    });
  };

  return (
    <Stack borderWidth="1px" borderRadius="md" padding={4}>
      <HStack justifyContent="space-between" flex={1}>
        <Text noOfLines={1} as="b" flex={1}>
          {name}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {dayjs(createdAt).fromNow()}
        </Text>
      </HStack>
      <HStack justifyContent="space-between" justifySelf="flex-end">
        <Text fontSize="sm" color="gray.500">
          {`Id: ${id}`}
        </Text>
        <HStack spacing={0}>
          <IconButton
            size="sm"
            variant="ghost"
            icon={<Icon color="gray.500" fontSize="lg" as={TbCopy} />}
            onClick={() => copyToClipboard()}
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

export default function TagsClientPage({ data, session }) {
  const [filteredData, setData] = useState();
  const [isCreatingTag, setIsCreatingTag] = useState();
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

  const onSubmit = async (values) => {
    await api.createTag({ ...values, color: "green.400" });

    if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
      analytics.track("Created Tag", { ...values });
    }

    toast({
      description: "Tag created",
      position: "top",
      colorScheme: "gray",
    });

    setData();
    router.refresh();
    reset();
    onClose();
  };

  const handleDelete = async (id) => {
    await api.deleteTag({ id });

    if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
      analytics.track("Deleted Tag", { id });
    }

    toast({
      description: "Tag deleted",
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

    const keysToFilter = ["name", "color"];
    const filteredItems = data.filter((item) =>
      keysToFilter.some((key) =>
        item[key].toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setData(filteredItems);
  };

  return (
    <Stack
      flex={1}
      paddingX={[6, 12]}
      paddingY={12}
      spacing={6}
      overflow="auto"
    >
      <HStack justifyContent="space-between" spacing={12}>
        <Stack>
          <Heading as="h1" fontSize="2xl">
            Tags
          </Heading>
          <Text color="gray.400" display={["none", "block"]}>
            Create, edit and delete tags.
          </Text>
        </Stack>
        <Button
          leftIcon={<Icon as={TbPlus} />}
          alignSelf="flex-start"
          onClick={onOpen}
        >
          New tag
        </Button>
      </HStack>
      <SearchBar
        onSearch={(values) => handleSearch(values)}
        onReset={() => setData(data)}
      />
      <Stack spacing={4}>
        <SimpleGrid columns={[1, 2, 2, 4]} gap={6}>
          {filteredData
            ? filteredData?.map(({ id, name, createdAt, color }) => (
                <TagCard
                  key={id}
                  id={id}
                  createdAt={createdAt}
                  name={name}
                  color={color}
                  onDelete={(id) => handleDelete(id)}
                />
              ))
            : data?.map(({ id, name, createdAt, color }) => (
                <TagCard
                  key={id}
                  id={id}
                  createdAt={createdAt}
                  name={name}
                  color={color}
                  onDelete={(id) => handleDelete(id)}
                />
              ))}
        </SimpleGrid>
      </Stack>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>New tag</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isCreatingTag && (
              <Center>
                <Stack alignItems="center" spacing={6} marginY="100px">
                  <Spinner size="sm" />
                  <Text color="gray.500">Creating tag...</Text>
                </Stack>
              </Center>
            )}
            {!isCreatingTag && (
              <Stack spacing={4}>
                <Stack>
                  <FormControl isRequired isInvalid={errors?.name}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      {...register("name", { required: true })}
                    />
                    <FormHelperText>A tag name.</FormHelperText>
                    {errors?.name && (
                      <FormErrorMessage>Invalid name</FormErrorMessage>
                    )}
                  </FormControl>
                </Stack>
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={onClose}
              isDisabled={isCreatingTag}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting || isCreatingTag}
              isDisabled={isCreatingTag}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}
