"use client";
import { useCallback, useState } from "react";
import NextLink from "next/link";
import {
  Button,
  Heading,
  Icon,
  FormControl,
  FormLabel,
  FormHelperText,
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
  Textarea,
  HStack,
  SimpleGrid,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { TbPlus } from "react-icons/tb";
import { useForm } from "react-hook-form";
import API from "@/lib/api";
import AgentCard from "./_components/card";
import { analytics } from "@/lib/analytics";
import SearchBar from "../_components/search-bar";
import FilterBar from "../_components/filter-bar";

export default function AgentsClientPage({ data, tags, session }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filteredData, setData] = useState();
  const [selectedAgent, setSelectedAgent] = useState();
  const router = useRouter();
  const toast = useToast();
  const api = new API(session);
  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
    setValue,
    reset,
  } = useForm();

  const handleDelete = async (id) => {
    await api.deleteAgent({ id });

    if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
      analytics.track("Deleted Agent", { id });
    }

    setData();
    router.refresh();
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

  const handleEdit = async (agentId) => {
    const agent = data.find(({ id }) => id === agentId);

    setSelectedAgent(agentId);
    setValue("name", agent?.name);
    setValue("description", agent?.description);
    setValue("avatarUrl", agent?.avatarUrl);
    onOpen();
  };

  const onUpdate = async (values) => {
    await api.patchAgent(selectedAgent, { ...values });

    toast({
      description: "Updated agent!",
      position: "top",
      colorScheme: "gray",
    });

    setSelectedAgent();
    onClose();

    router.refresh();
  };

  return (
    <Stack
      paddingX={[6, 12]}
      paddingY={12}
      spacing={6}
      flex={1}
      overflow="auto"
    >
      <HStack justifyContent="space-between">
        <Stack>
          <Heading as="h1" fontSize="2xl">
            Agents
          </Heading>
          <Text color="gray.400" display={["none", "block"]}>
            Create and manage Agents.
          </Text>
        </Stack>
        <NextLink passHref href="/agents/new">
          <Button leftIcon={<Icon as={TbPlus} />} alignSelf="flex-start">
            New agent
          </Button>
        </NextLink>
      </HStack>
      <SearchBar
        onSearch={(values) => handleSearch(values)}
        onReset={() => setData(data)}
      />
      <FilterBar
        items={filteredData || data}
        filters={tags}
        onFilter={(values) => setData(values)}
      />
      <SimpleGrid columns={[1, 2, 2, 4]} gap={6}>
        {filteredData
          ? filteredData?.map(
              ({ id, description, llm, createdAt, hasMemory, name, type }) => (
                <AgentCard
                  key={id}
                  createdAt={createdAt}
                  description={description}
                  id={id}
                  name={name}
                  llm={llm}
                  type={type}
                  hasMemory={hasMemory}
                  onDelete={(id) => handleDelete(id)}
                  onEdit={(id) => handleEdit(id)}
                />
              )
            )
          : data?.map(
              ({ id, description, llm, createdAt, hasMemory, name, type }) => (
                <AgentCard
                  key={id}
                  createdAt={createdAt}
                  description={description}
                  id={id}
                  name={name}
                  llm={llm}
                  type={type}
                  hasMemory={hasMemory}
                  onDelete={(id) => handleDelete(id)}
                  onEdit={(id) => handleEdit(id)}
                />
              )
            )}
      </SimpleGrid>
      <Modal
        isOpen={isOpen}
        size="xl"
        onClose={() => {
          reset();
          onClose();
          setSelectedAgent();
        }}
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onUpdate)}>
          <ModalHeader>Edit agent</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Stack>
                <FormControl isRequired isInvalid={errors?.name}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    {...register("name", { required: true })}
                  />
                  <FormHelperText>The agent name</FormHelperText>
                  {errors?.name && (
                    <FormErrorMessage>Invalid name</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isRequired isInvalid={errors?.description}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    placeholder="What does this Agent do? How should we use it?"
                    {...register("description", { required: true })}
                  />
                  <FormHelperText>
                    This description will be visible when you share the agent.
                  </FormHelperText>
                  {errors?.description && (
                    <FormErrorMessage>Invalid description</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel>Avatar URL</FormLabel>
                  <Input type="text" {...register("avatarUrl")} />
                  <FormHelperText>
                    A public URL to a avatar/logo you would like to use
                  </FormHelperText>
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
                setSelectedAgent();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}
