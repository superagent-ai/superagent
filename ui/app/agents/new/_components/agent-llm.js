import { useEffect } from "react";
import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Icon,
  Select,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { TbChevronRight } from "react-icons/tb";
import { LLMS } from "@/lib/llm";

export default function AgentLLM({ onSubmit, data }) {
  const isOpenAIWithTools =
    (data.documents?.length > 0 || data.tools?.length > 0) &&
    data.type == "OPENAI";
  const {
    formState: { isSubmitting, errors },
    register,
    watch,
    setValue,
    handleSubmit,
  } = useForm({ values: { provider: "openai-chat" } });
  const provider = watch("provider");
  const handleOnSubmit = async (values) => {
    const { api_key, provider, model, has_memory } = values;

    onSubmit({ llm: { provider, model, api_key }, has_memory });
  };

  useEffect(() => {
    const model = LLMS.find(({ id }) => id === provider)?.models?.[0];

    setValue("model", model);
  }, [provider, setValue]);

  return (
    <Container maxWidth="md" as="form" onSubmit={handleSubmit(handleOnSubmit)}>
      <Stack spacing={10}>
        <Text fontSize="lg" fontWeight="bold">
          Select a Large Language Model
        </Text>
        <Stack spacing={3}>
          {!isOpenAIWithTools && (
            <FormControl isRequired isInvalid={errors?.provider}>
              <FormLabel>LLM Provider</FormLabel>
              <Select {...register("provider", { required: true })}>
                {LLMS.map(({ id, name }) => (
                  <option value={id} key={id}>
                    {name}
                  </option>
                ))}
              </Select>
              {errors?.provider && (
                <FormErrorMessage>Invalid provider</FormErrorMessage>
              )}
            </FormControl>
          )}

          <FormControl isRequired isInvalid={errors?.model}>
            <FormLabel>LLM Model</FormLabel>
            {isOpenAIWithTools ? (
              <Select
                {...register("model", { required: true })}
                placeholder="Select model..."
              >
                <option key="gpt-3.5-turbo-16k-0613">
                  gpt-3.5-turbo-16k-0613
                </option>
                <option key="gpt-3.5-turbo-0613">gpt-3.5-turbo-0613</option>
                <option key="gpt-4-0613">gpt-4-0613</option>
              </Select>
            ) : (
              <>
                {provider === "huggingface" ? (
                  <Input
                    type="text"
                    placeholder="Add repo id..."
                    {...register("model", { required: true })}
                  />
                ) : (
                  <Select
                    {...register("model", { required: true })}
                    placeholder="Select model..."
                  >
                    {LLMS.find(({ id }) => id === provider)?.models.map(
                      (model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      )
                    )}
                  </Select>
                )}
              </>
            )}

            {errors?.model && (
              <FormErrorMessage>Invalid mmodel</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isRequired isInvalid={errors?.api_key}>
            <FormLabel>LLM API key</FormLabel>
            <Input
              type="password"
              {...register("api_key", { required: true })}
            />
            <FormHelperText>
              An optional API key for the specific LLM provider.
            </FormHelperText>
          </FormControl>
          <FormControl isInvalid={errors?.has_memory}>
            <HStack alignItems="center">
              <FormLabel marginTop={1}>Enable memory</FormLabel>
              <Switch
                name="has_memory"
                {...register("has_memory")}
                colorScheme="green"
              />
            </HStack>

            <FormHelperText>
              Enabling Agent memory increases the amount of context the model
              has.
            </FormHelperText>
          </FormControl>
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
