"use client";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Link,
  Stack,
  Select,
  Spinner,
  FormHelperText,
  FormErrorMessage,
  Textarea,
  Center,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import CodeMirror from "@uiw/react-codemirror";
import { useAsyncFn } from "react-use";
import { json, jsonLanguage } from "@codemirror/lang-json";
import { languages } from "@codemirror/language-data";
import { githubDark } from "@uiw/codemirror-theme-github";
import { EditorView } from "@codemirror/view";
import API from "@/lib/api";
import { useEffect, useState } from "react";

const REPLICATE_ARGUMENTS = { image_dimensions: "512x512" };
const AUTHENTICATION_ARGUMENTS = { authorization: "Bearer: " };

export default function ToolsModal({ onSubmit, onClose, isOpen, tool }) {
  const [selectedTool, setSelectedTool] = useState();
  const {
    formState: { isSubmitting, errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm({ values: { arguments: REPLICATE_ARGUMENTS } });
  const type = watch("type");
  const headers = watch("headers");
  const args = watch("arguments");
  const session = useSession();
  const [{ loading: isLoadingAgents, value: agents = [] }, getAgents] =
    useAsyncFn(async (api) => api.getAgents(), []);
  const onHandleSubmt = async (values) => {
    const { type, name, description, ...metadata } = values;
    await onSubmit({ type, name, description, metadata: { ...metadata } });
    reset();
  };

  useEffect(() => {
    const fetchAgents = async () => {
      if (session.data) {
        const api = new API(session?.data);
        getAgents(api);
      }
    };

    fetchAgents();
  }, [session]);

  useEffect(() => {
    setSelectedTool(tool);
  }, [tool]);

  useEffect(() => {
    setValue("name", selectedTool?.name);
    setValue("description", selectedTool?.description);
    setValue("type", selectedTool?.type);

    if (selectedTool) {
      for (const [key, value] of Object.entries(selectedTool?.metadata)) {
        setValue(key, value);
      }
    }
  }, [selectedTool]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        setSelectedTool();
        onClose();
      }}
      size="xl"
    >
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onHandleSubmt)}>
        <ModalHeader>{selectedTool ? "Edit tool" : "New tool"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <Stack>
              <FormControl isRequired isInvalid={errors?.type}>
                <FormLabel>Type</FormLabel>
                <Select {...register("type", { required: true })}>
                  <option value="SEARCH">Websearch</option>
                  <option value="AGENT">Superagent</option>
                  <option value="WOLFRAM_ALPHA">Wolfram Alpha</option>
                  <option value="REPLICATE">Replicate</option>
                  <option value="ZAPIER_NLA">Zapier</option>
                  <option value="OPENAPI">APIs</option>
                  <option value="CHATGPT_PLUGIN">ChatGPT Plugin</option>
                  <option value="METAPHOR">Metaphor Search</option>
                </Select>
                {errors?.type && (
                  <FormErrorMessage>Invalid type</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={errors?.name}>
                <FormLabel>Name</FormLabel>
                <Input type="text" {...register("name", { required: true })} />
                <FormHelperText>A tool name.</FormHelperText>
                {errors?.name && (
                  <FormErrorMessage>Invalid name</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={errors?.description}>
                <FormLabel>When to use</FormLabel>
                <Textarea
                  placeholder="Useful for X..."
                  {...register("description", { required: true })}
                />
                <FormHelperText>
                  When should the agent use this tool?{" "}
                </FormHelperText>
                {errors?.description && (
                  <FormErrorMessage>Invalid description</FormErrorMessage>
                )}
              </FormControl>
              {type === "OPENAPI" && (
                <>
                  <FormControl isRequired>
                    <FormLabel>OpenAPI spec URL</FormLabel>
                    <Input
                      type="text"
                      {...register("openApiUrl", { required: true })}
                      placeholder="Enter a URL the OpenAPI spec"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Authentication headers</FormLabel>
                    <Box borderRadius="md" overflow="hidden">
                      <CodeMirror
                        onChange={(value) => setValue("headers", value)}
                        editable={true}
                        extensions={[
                          json({
                            base: jsonLanguage,
                            codeLanguages: languages,
                          }),
                          EditorView.lineWrapping,
                        ]}
                        theme={githubDark}
                        value={
                          headers
                            ? headers
                            : JSON.stringify(AUTHENTICATION_ARGUMENTS, null, 2)
                        }
                      />
                    </Box>
                  </FormControl>
                </>
              )}
              {type === "CHATGPT_PLUGIN" && (
                <>
                  <FormControl isRequired>
                    <FormLabel>ChatGPT Plugin URL</FormLabel>
                    <Input
                      type="text"
                      {...register("chatgptPluginURL", { required: true })}
                      placeholder="Enter a URL for the plugin"
                    />
                  </FormControl>
                </>
              )}
              {type === "AGENT" && (
                <FormControl isRequired>
                  <FormLabel>Select a Superagent</FormLabel>
                  {isLoadingAgents ? (
                    <Center>
                      <Spinner size="xs" />
                    </Center>
                  ) : (
                    <Select {...register("agentId", { required: true })}>
                      {agents.map(({ id, name }) => (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      ))}
                    </Select>
                  )}
                  <FormHelperText>Select an Agent</FormHelperText>
                </FormControl>
              )}
              {type === "METAPHOR" && (
                <FormControl isRequired>
                  <FormLabel>Metaphor api key</FormLabel>
                  <Input
                    type="password"
                    {...register("metaphor_api_key", { required: true })}
                    placeholder="Enter Metaphor api key..."
                  />
                  <FormHelperText>
                    Obtain your Metaphor API key{" "}
                    <Link
                      color="orange.500"
                      href="https://platform.metaphor.systems/"
                      target="_blank"
                    >
                      here.
                    </Link>
                  </FormHelperText>
                </FormControl>
              )}
              {type === "ZAPIER_NLA" && (
                <FormControl isRequired>
                  <FormLabel>Zapier NLA api key</FormLabel>
                  <Input
                    type="password"
                    {...register("zapier_nla_api_key", { required: true })}
                    placeholder="Enter Zapier NLA api key..."
                  />
                  <FormHelperText>
                    Obtain your Zapier API key by{" "}
                    <Link
                      color="orange.500"
                      href="https://nla.zapier.com/start/"
                      target="_blank"
                    >
                      following this guide.
                    </Link>
                  </FormHelperText>
                </FormControl>
              )}
              {type === "REPLICATE" && (
                <>
                  <FormControl isRequired>
                    <FormLabel>Replicate model</FormLabel>
                    <Input
                      type="text"
                      {...register("model", { required: true })}
                      placeholder="Enter replicate model..."
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Replicate api key</FormLabel>
                    <Input
                      type="password"
                      {...register("api_key", { required: true })}
                      placeholder="Enter api key..."
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Model arguments</FormLabel>
                    <Box borderRadius="md" overflow="hidden">
                      <CodeMirror
                        onChange={(value) => setValue("arguments", value)}
                        editable={true}
                        extensions={[
                          json({
                            base: jsonLanguage,
                            codeLanguages: languages,
                          }),
                          EditorView.lineWrapping,
                        ]}
                        theme={githubDark}
                        value={JSON.stringify(
                          args || REPLICATE_ARGUMENTS,
                          null,
                          2
                        )}
                      />
                    </Box>
                  </FormControl>
                </>
              )}
            </Stack>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {selectedTool ? "Update" : "Create"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
