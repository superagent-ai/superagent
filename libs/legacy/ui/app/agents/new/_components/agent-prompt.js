import {
  Alert,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  Stack,
  Tag,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { TbChevronRight, TbInfoCircle } from "react-icons/tb";
import {
  getPromptVariables,
  DEFAULT_PROMPT,
  REACT_AGENT_PROMPT,
} from "@/lib/prompts";

export default function AgentPrompt({ onSubmit, data }) {
  const isOpenAIWithTools =
    (data.documents?.length > 0 || data.tools?.length > 0) &&
    data.type == "OPENAI";

  const getPromptTemplate = () => {
    const { tools, documents, type } = data;

    if ((tools.length > 0 || documents.length > 0) && type !== "OPENAI") {
      return REACT_AGENT_PROMPT;
    }

    if ((tools.length > 0 || documents.length > 0) && type === "OPENAI") {
      return;
    }

    return DEFAULT_PROMPT;
  };

  const {
    formState: { isSubmitting },
    register,
    watch,
    handleSubmit,
  } = useForm({ values: { prompt: getPromptTemplate() } });
  const prompt = watch("prompt");

  return (
    <Container maxWidth="lg" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={10}>
        <Stack>
          <Text fontSize="lg" fontWeight="bold">
            Add a prompt
          </Text>
          <Text color="gray.500">
            Use a custom prompt to define how your agent should act.
          </Text>
        </Stack>
        <Stack spacing={3}>
          {!isOpenAIWithTools && (
            <Alert status="error">
              <HStack alignItems="flex-start">
                <Icon as={TbInfoCircle} marginTop={1} />
                <Text>
                  Make sure to keep the input variables inside the brackets for
                  best performance.
                </Text>
              </HStack>
            </Alert>
          )}
          <FormControl>
            <Textarea
              minHeight="300px"
              placeholder="You are an AI assistant..."
              {...register("prompt")}
            />
            {!isOpenAIWithTools && (
              <FormHelperText>
                Input variables can be defined by using handlebars, ex:{" "}
                <Tag size="sm">{`{input}`}</Tag>
              </FormHelperText>
            )}
          </FormControl>
          {!isOpenAIWithTools && (
            <FormControl>
              <FormLabel>Prompt variables</FormLabel>
              <HStack>
                {getPromptVariables(prompt).map((variable) => (
                  <Tag key={variable}>{variable}</Tag>
                ))}
              </HStack>
            </FormControl>
          )}
        </Stack>
        <Button
          type="submit"
          isLoading={isSubmitting}
          rightIcon={<Icon as={TbChevronRight} />}
          alignSelf="flex-end"
        >
          Next
        </Button>
      </Stack>
    </Container>
  );
}
