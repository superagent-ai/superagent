"use client";
import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  Select,
  Spinner,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useAsync } from "react-use";
import { useForm } from "react-hook-form";
import API from "@/lib/api";

export default function ToolPickerModal({
  onSubmit,
  onClose,
  isOpen,
  session,
}) {
  const api = new API(session);
  const { loading: isLoadingTools, value: tools = [] } = useAsync(async () =>
    api.getTools()
  );
  const {
    formState: { isSubmitting, errors },
    handleSubmit,
    register,
    reset,
  } = useForm();

  const onHandleSubmt = async (values) => {
    await onSubmit(values);
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onHandleSubmt)}>
        <ModalHeader>Select tool</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            {isLoadingTools ? (
              <Center>
                <Spinner />
              </Center>
            ) : (
              <Stack>
                <FormControl isRequired isInvalid={errors?.type}>
                  <FormLabel>Select tool</FormLabel>
                  <Select {...register("toolId", { required: true })}>
                    {tools.map(({ id, name }) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </Select>
                  {errors?.type && (
                    <FormErrorMessage>Select a tool</FormErrorMessage>
                  )}
                </FormControl>
              </Stack>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
