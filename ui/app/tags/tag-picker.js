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

export default function TagPickerModal({
  onSubmit,
  onClose,
  isOpen,
  session,
}) {
  const api = new API(session);
  const { loading: isLoadingTags, value: tags = [] } = useAsync(
    async () => api.getTags()
  );
  const {
    formState: { isSubmitting, errors },
    handleSubmit,
    register,
    reset,
  } = useForm();

  const onHandleSubmt = async (values) => {
    const tag = tags.find(({id}) => id === values.tagId);
    await onSubmit(tag);
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onHandleSubmt)}>
        <ModalHeader>Select tag</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            {isLoadingTags ? (
              <Center>
                <Spinner />
              </Center>
            ) : (
              <Stack>
                <FormControl isRequired isInvalid={errors?.tagId}>
                  <FormLabel>Select tag</FormLabel>
                  <Select {...register("tagId", { required: true })}>
                    {tags.map(({ id, name }) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </Select>
                  {errors?.tagId && (
                    <FormErrorMessage>Select a tag</FormErrorMessage>
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
