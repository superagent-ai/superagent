import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { TbChevronRight } from "react-icons/tb";

export default function AgentStoreInfo({ onSubmit }) {
  const {
    formState: { isSubmitting },
    register,
    handleSubmit,
  } = useForm();
  return (
    <Container maxWidth="md" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={10}>
        <Text fontSize="lg" fontWeight="bold">
          Add a name and description
        </Text>
        <Stack spacing={3}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              {...register("name", { required: true })}
              placeholder="Name your agent..."
            />
          </FormControl>
          <FormControl>
            <FormLabel>Avatar URL</FormLabel>
            <Input
              type="text"
              {...register("avatarUrl", { required: false })}
              placeholder="Enter a public URL..."
            />
            <FormHelperText>Add an avatar to your agent.</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              minHeight="200px"
              type="text"
              {...register("description", { required: true })}
              placeholder="Add description that will be visible in Agent library"
            />
            <FormHelperText>
              Add a description to your Agent to make it visible in the Agent
              library.
            </FormHelperText>
          </FormControl>
        </Stack>
        <Button
          type="submit"
          isLoading={isSubmitting}
          rightIcon={<Icon as={TbChevronRight} />}
          alignSelf="flex-end"
        >
          Create agent
        </Button>
      </Stack>
    </Container>
  );
}
