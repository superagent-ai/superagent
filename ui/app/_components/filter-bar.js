"use client";
import { useCallback, useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import {
  Box,
  HStack,
  Icon,
  InputGroup,
  InputLeftElement,
  Select,
  Text,
} from "@chakra-ui/react";
import { TbTag } from "react-icons/tb";

export default function FilterBar({ items = [], filters = [], onFilter }) {
  const [items_, setItems_] = useState(items);

  const handleFilter = useCallback(async (event) => {
    const value = event.target.value;
    if (value.length > 0) {
      setItems_(
        items.filter((item) => item.tags.some((tag) => tag.id === value))
      );

      return;
    }

    setItems_(items);
  }, []);

  useEffect(() => {
    onFilter(items_);
  }, [items_]);

  return (
    <HStack justifyContent="space-between">
      <HStack flex={1}>
        <Text color="gray.500">Showing: </Text>
        <Text>{items_.length} agents</Text>
      </HStack>
      <HStack
        justifyContent="flex-start"
        paddingX={4}
        paddingY={2}
        borderWidth="1px"
        borderRadius="md"
      >
        <Icon as={TbTag} />
        <Select onChangeCapture={handleFilter} variant="unstyled">
          <option value="">Select tag...</option>
          {filters.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </Select>
      </HStack>
    </HStack>
  );
}
