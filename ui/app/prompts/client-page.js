"use client";
import { useState } from "react";
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
  Tag,
  Textarea,
  Text,
  useDisclosure,
  FormHelperText,
  FormErrorMessage,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { TbPlus, TbInfoCircle } from "react-icons/tb";
import { useForm } from "react-hook-form";
import API from "@/lib/api";
import { analytics } from "@/lib/analytics";
import { getPromptVariables, DEFAULT_PROMPT } from "@/lib/prompts";
import PromptCard from "./_components/card";
import SearchBar from "../_components/search-bar";

export default function PromptsClientPage({ data, session }) {
  const [filteredData, setData] = useState();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedPrompt, setSelectedPrompt] = useState();
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
  } = useForm({
    values: {
      template: DEFAULT_PROMPT,
    },
  });

  const template = watch("template");

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      input_variables: getPromptVariables(values.template) || [],
    };

    if (selectedPrompt) {
      await api.patchPrompt(selectedPrompt, payload);

      if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
        analytics.track("Updated Prompt", { ...payload });
      }
    } else {
      await api.createPrompt(payload);
      if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
        analytics.track("Created Prompt", { ...payload });
      }
    }

    toast({
      description: "Prompt created",
      position: "top",
      colorScheme: "gray",
    });

    router.refresh();
    reset();
    setData();
    setSelectedPrompt();
    onClose();
  };

  const handleDelete = async (id) => {
    await api.deletePrompt({ id });

    if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
      analytics.track("Deleted Prompt", { id });
    }

    toast({
      description: "Prompt deleted",
      position: "top",
      colorScheme: "gray",
    });

    setData();
    router.refresh();
  };

  const handleEdit = async (promptId) => {
    const prompt = data.find(({ id }) => id === promptId);

    setSelectedPrompt(promptId);
    setValue("name", prompt?.name);
    setValue("template", prompt?.template);
    onOpen();
  };

  const handleSearch = ({ searchTerm }) => {
    if (!searchTerm) {
      setData(data);
    }

    const keysToFilter = ["name"];
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
      <HStack justifyContent="space-between">
        <Stack>
          <Heading as="h1" fontSize="2xl">
            Prompts
          </Heading>
          <Text color="gray.400" display={["none", "block"]}>
            Manage your prompts
          </Text>
        </Stack>
        <Button
          leftIcon={<Icon as={TbPlus} />}
          alignSelf="flex-start"
          onClick={onOpen}
        >
          New prompt
        </Button>
      </HStack>
      <SearchBar
        onSearch={(values) => handleSearch(values)}
        onReset={() => setData(data)}
      />
      <Stack spacing={4}>
        <SimpleGrid columns={[1, 2, 2, 4]} gap={6}>
          {filteredData
            ? filteredData?.map(
                ({ id, name, createdAt, template, input_variables }) => (
                  <PromptCard
                    key={id}
                    id={id}
                    createdAt={createdAt}
                    name={name}
                    template={template}
                    inputVariables={input_variables}
                    onDelete={(id) => handleDelete(id)}
                    onEdit={(id) => handleEdit(id)}
                  />
                )
              )
            : data?.map(
                ({ id, name, createdAt, template, input_variables }) => (
                  <PromptCard
                    key={id}
                    id={id}
                    createdAt={createdAt}
                    name={name}
                    template={template}
                    inputVariables={input_variables}
                    onDelete={(id) => handleDelete(id)}
                    onEdit={(id) => handleEdit(id)}
                  />
                )
              )}
        </SimpleGrid>
      </Stack>
      <Modal
        isOpen={isOpen}
        size="xl"
        onClose={() => {
          reset();
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            {selectedPrompt ? "Edit prompt" : "New prompt"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Alert status="error">
                <HStack alignItems="flex-start">
                  <Icon as={TbInfoCircle} marginTop={1} />
                  <Text>
                    Make sure to include the {`{chat_history}`} input variable
                    if you want the agent to have a memory of past queries.
                  </Text>
                </HStack>
              </Alert>
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
                <FormControl isRequired isInvalid={errors?.template}>
                  <FormLabel>Prompt template</FormLabel>
                  <Textarea
                    minHeight="300px"
                    placeholder="You are an AI assistant"
                    {...register("template", { required: true })}
                  />
                  <FormHelperText>
                    Input variables can be defined by using handlebars, ex:{" "}
                    <Tag size="sm">{`{human_input}`}</Tag>
                  </FormHelperText>
                  {errors?.template && (
                    <FormErrorMessage>Invalid template</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel>Input variables</FormLabel>
                  <HStack>
                    {getPromptVariables(template).map((variable) => (
                      <Tag key={variable}>{variable}</Tag>
                    ))}
                  </HStack>
                </FormControl>
              </Stack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {selectedPrompt ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}
