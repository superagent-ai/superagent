import { useState } from "react";
import {
  Button,
  FormControl,
  HStack,
  Icon,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { TbChevronRight, TbSend } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { fetchEventSource } from "@microsoft/fetch-event-source";

const STREAMING_SUPPORT = ["openai", "openai-chat", "anthropic"];

export default function Run({ apiTokens, id, llm, document, tool, type }) {
  const [message, setMessage] = useState(null);
  const [response, setResponse] = useState(null);
  const backgroundColor = useColorModeValue("#131416", "#fffff");
  const {
    formState: { isSubmitting, errors },
    handleSubmit,
    register,
    reset,
  } = useForm();

  const getDocumentPayload = (documentType, message) => {
    if (documentType === "OPENAPI") {
      return { input: message };
    }

    return { question: message };
  };

  const getLLMInput = (message) => {
    if (type === "OPENAI") {
      return { input: message };
    }

    return { human_input: message };
  };

  const onSubmit = async ({ message }) => {
    let response = "";

    const payload = document
      ? getDocumentPayload(document?.type, message)
      : getLLMInput(message);
    const ctrl = new AbortController();

    setResponse();
    setMessage(message);

    if (
      STREAMING_SUPPORT.includes(llm.provider) &&
      document?.type !== "OPENAPI" &&
      !tool
    ) {
      await fetchEventSource(
        `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/agents/${id}/predict`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            X_SUPERAGENT_API_KEY: apiTokens[0]?.token,
          },
          body: JSON.stringify({
            input: { ...payload },
            has_streaming: true,
          }),
          signal: ctrl.signal,
          async onmessage(event) {
            if (event.data !== "[END]") {
              response += event.data === "" ? `${event.data} \n` : event.data;
              setResponse(response);
            }
          },
        }
      );

      reset();

      return;
    }

    response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/agents/${id}/predict`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          X_SUPERAGENT_API_KEY: apiTokens[0]?.token,
        },
        body: JSON.stringify({
          input: { ...payload },
          has_streaming: false,
        }),
      }
    );

    const { data: prediction } = await response.json();

    setResponse(prediction);
    reset();
  };

  return (
    <Stack spacing={4}>
      <Stack
        padding={4}
        fontFamily="monospace"
        backgroundColor={backgroundColor}
        height="300px"
        fontSize="md"
        borderRadius="md"
        overflow="auto"
      >
        {message && (
          <HStack alignItems="flex-start">
            <Icon as={TbChevronRight} marginTop={1} />
            <Text color="orange.300">{message}</Text>
          </HStack>
        )}
        {response && (
          <HStack alignItems="flex-start">
            <Icon as={TbChevronRight} marginTop={1} />
            <Text color="green.300" fontWeight="bold">
              {response}
            </Text>
          </HStack>
        )}
      </Stack>
      <HStack as="form" onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors?.name}>
          <Input
            variant="filled"
            isDisabled={isSubmitting || !apiTokens}
            name="message"
            type="text"
            placeholder="Enter message..."
            {...register("message", { required: true })}
          />
        </FormControl>
        <Button
          type="submit"
          isDisabled={!apiTokens}
          isLoading={isSubmitting}
          leftIcon={<Icon as={TbSend} isLoading={isSubmitting} />}
        >
          Send
        </Button>
      </HStack>
    </Stack>
  );
}
