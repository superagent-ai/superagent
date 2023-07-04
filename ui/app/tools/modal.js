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
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import CodeMirror from "@uiw/react-codemirror";
import { json, jsonLanguage } from "@codemirror/lang-json";
import { languages } from "@codemirror/language-data";
import { githubDark } from "@uiw/codemirror-theme-github";
import { EditorView } from "@codemirror/view";

const REPLICATE_ARGUMENTS = { image_dimensions: "512x512" };

export default function ToolsModal({ onSubmit, onClose, isOpen }) {
  const {
    formState: { isSubmitting, errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm();
  const type = watch("type");

  const onHandleSubmt = async (values) => {
    const { type, name, ...metadata } = values;

    await onSubmit({ type, name, metadata: { ...metadata } });
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onHandleSubmt)}>
        <ModalHeader>New tool</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <Stack>
              <FormControl isRequired isInvalid={errors?.name}>
                <FormLabel>Name</FormLabel>
                <Input type="text" {...register("name", { required: true })} />
                <FormHelperText>A tool name.</FormHelperText>
                {errors?.name && (
                  <FormErrorMessage>Invalid name</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={errors?.type}>
                <FormLabel>Type</FormLabel>
                <Select {...register("type", { required: true })}>
                  <option value="SEARCH">Websearch</option>
                  <option value="WOLFRAM_ALPHA">Wolfram Alpha</option>
                  <option value="REPLICATE">Replicate</option>
                  <option value="ZAPIER_NLA">Zapier</option>
                </Select>
                {errors?.type && (
                  <FormErrorMessage>Invalid type</FormErrorMessage>
                )}
              </FormControl>
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
                        value={JSON.stringify(REPLICATE_ARGUMENTS, null, 2)}
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
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
