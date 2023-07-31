import NextLink from "next/link";
import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  HStack,
  Icon,
  Spinner,
  Stack,
  Switch,
  Text,
  Tag,
  useColorModeValue,
} from "@chakra-ui/react";
import API from "@/lib/api";
import { TOOL_ICONS, UPCOMING_TOOLS } from "@/lib/constants";
import { useAsync } from "react-use";
import { useForm } from "react-hook-form";
import { TbChevronRight, TbPlus, TbSearch } from "react-icons/tb";

export default function AgentTool({ onSubmit, session }) {
  const api = new API(session);
  const { loading: isLoading, value: tools = [] } = useAsync(
    () => api.getTools(),
    []
  );
  const {
    formState: { isSubmitting },
    setValue,
    handleSubmit,
    watch,
  } = useForm({ values: { selectedTools: [] } });
  const selectedTools = watch("selectedTools");

  const handleSelect = (toolId, isChecked) => {
    setValue(
      "selectedTools",
      isChecked
        ? selectedTools.concat(toolId)
        : selectedTools.filter((id) => id !== toolId)
    );
  };

  return (
    <Container maxWidth="md" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={10}>
        <Stack spacing={6}>
          <Stack>
            <Text fontSize="lg" fontWeight="bold">
              Add tools
            </Text>
            <Text color="gray.500">
              Connect your agent to third party tools.
            </Text>
          </Stack>
          <Stack>
            <Box position="relative">
              <Stack
                maxHeight="300px"
                overflow="auto"
                paddingBottom={10}
                spacing={3}
              >
                {isLoading && (
                  <Center flex={1}>
                    <Spinner size="sm" />
                  </Center>
                )}
                {!isLoading && tools.length === 0 && (
                  <Center
                    flex={1}
                    borderWidth="0.5px"
                    borderRadius="md"
                    padding={4}
                  >
                    <Stack alignItems="center" spacing={4}>
                      <Stack alignItems="center">
                        <Text as="b">Create your first tool</Text>
                        <Text color="gray.500">
                          You haven&apos;t configured any tools.{" "}
                        </Text>
                      </Stack>
                      <NextLink passHref href="/tools">
                        <Button
                          leftIcon={<Icon as={TbPlus} />}
                          variant="outline"
                        >
                          Create tool
                        </Button>
                      </NextLink>
                    </Stack>
                  </Center>
                )}
                {!isLoading &&
                  tools.map(({ id, name, type }) => (
                    <HStack
                      key={id}
                      justifyContent="space-between"
                      borderRadius="md"
                      borderWidth="0.5px"
                      paddingY={2}
                      paddingX={4}
                    >
                      <HStack spacing={4}>
                        <Avatar
                          src={
                            type === "AGENT" ? "/logo.png" : TOOL_ICONS[type]
                          }
                          name={name}
                          size="xs"
                        />
                        <Text fontWeight="bold">{name}</Text>
                      </HStack>
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
                {!isLoading &&
                  UPCOMING_TOOLS.map(({ id, name, type }) => (
                    <HStack
                      key={id}
                      justifyContent="space-between"
                      borderRadius="md"
                      borderWidth="0.5px"
                      paddingY={2}
                      paddingX={4}
                      opacity={0.3}
                    >
                      <HStack spacing={4}>
                        <Avatar
                          src={TOOL_ICONS[type]}
                          size="xs"
                          borderRadius="none"
                        />
                        <Text fontWeight="bold">{name}</Text>
                      </HStack>
                      <Tag size="sm">Coming soon</Tag>
                    </HStack>
                  ))}
              </Stack>
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                height="50px"
                bgGradient={useColorModeValue(
                  "linear(to-t, #FFF, transparent)",
                  "linear(to-t, #131416, transparent)"
                )}
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
