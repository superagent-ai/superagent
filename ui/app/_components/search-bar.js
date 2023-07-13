"use client";
import { useCallback, useState } from "react";
import {
  InputGroup,
  Input,
  InputLeftElement,
  Button,
  Icon,
  Spinner,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { TbSearch, TbX } from "react-icons/tb";
import { useForm } from "react-hook-form";

export default function SearchBar({ onSearch, onReset }) {
  const {
    formState: { isSubmitting },
    register,
    handleSubmit,
    reset,
    watch,
  } = useForm();

  const searchTerm = watch("searchTerm");

  const handleReset = useCallback(() => {
    onReset();
    reset();
  }, []);

  return (
    <HStack>
      <InputGroup as="form" onSubmit={handleSubmit(onSearch)}>
        <InputLeftElement>
          {isSubmitting ? <Spinner size="sm" /> : <Icon as={TbSearch} />}
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search..."
          {...register("searchTerm", { required: true })}
        />
      </InputGroup>
      {searchTerm && (
        <>
          <Button
            leftIcon={<Icon as={TbX} />}
            onClick={handleReset}
            display={["none", "block"]}
          >
            Reset
          </Button>
          <IconButton
            icon={
              <Icon
                as={TbX}
                onClick={handleReset}
                display={["block", "none"]}
              />
            }
          />
        </>
      )}
    </HStack>
  );
}
