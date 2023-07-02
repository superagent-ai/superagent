import NextLink from "next/link";
import {
  Box,
  Button,
  Center,
  Container,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";
import API from "@/lib/api";
import { useAsync } from "react-use";
import { useForm } from "react-hook-form";
import { TbChevronRight, TbPlus, TbSearch } from "react-icons/tb";

export default function AgentDocument({ onSubmit, session }) {
  const api = new API(session);
  const { loading: isLoading, value: documents = [] } = useAsync(
    () => api.getDocuments(),
    []
  );
  const {
    formState: { isSubmitting },
    setValue,
    handleSubmit,
    watch,
  } = useForm({ values: { selectedDocuments: [] } });
  const selectedDocuments = watch("selectedDocuments");

  const handleSelect = (documentId, isChecked) => {
    setValue(
      "selectedDocuments",
      isChecked
        ? selectedDocuments.concat(documentId)
        : selectedDocuments.filter((id) => id !== documentId)
    );
  };

  return (
    <Container maxWidth="md" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={10}>
        <Stack spacing={6}>
          <Stack>
            <Text fontSize="lg" fontWeight="bold">
              Add documents
            </Text>
            <Text color="gray.500">Add documents to your agent.</Text>
          </Stack>
          <Stack>
            <Box position="relative">
              <Stack
                maxHeight="250px"
                overflow="auto"
                paddingBottom={10}
                spacing={3}
              >
                {isLoading && (
                  <Center flex={1}>
                    <Spinner size="sm" />
                  </Center>
                )}
                {!isLoading &&
                  documents.map(({ id, name, type }) => (
                    <HStack
                      backgroundColor="#222"
                      key={id}
                      justifyContent="space-between"
                      borderRadius="md"
                      borderWidth="0.5px"
                      paddingY={2}
                      paddingX={4}
                    >
                      <Text fontWeight="bold">{name}</Text>
                      <Switch
                        id="email-alerts"
                        colorScheme="green"
                        variant="solid"
                        onChange={(event) =>
                          handleSelect(id, event.target.checked)
                        }
                      />
                    </HStack>
                  ))}
                {!isLoading && documents.length === 0 && (
                  <Center flex={1} borderWidth="0.5px" borderRadius="md">
                    <Stack alignItems="center" spacing={4}>
                      <Text color="gray.500">
                        You haven&apos;t added any documents.{" "}
                      </Text>
                      <NextLink passHref href="/documents">
                        <Button
                          leftIcon={<Icon as={TbPlus} />}
                          variant="outline"
                        >
                          Create document
                        </Button>
                      </NextLink>
                    </Stack>
                  </Center>
                )}
              </Stack>
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                height="50px"
                bgGradient="linear(to-t, #131416, transparent)"
              />
            </Box>
          </Stack>
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
