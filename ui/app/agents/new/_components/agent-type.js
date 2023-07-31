import {
  Button,
  Container,
  HStack,
  Icon,
  Input,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { TbChevronRight, TbBolt, TbAlertTriangle } from "react-icons/tb";

const OPTION_TYPES = [
  {
    id: "OPENAI",
    name: "OpenAI",
    description:
      "Utilizes the new OpenAI models and functions. Great for retrieving structured data.",
    icon: "",
  },
  {
    id: "REACT",
    name: "ReAct",
    description:
      "An Agent utilizing the ReAct framework. Useful for when you want the Agent to do decision making.",
    icon: "",
  },
];

export default function AgentType({ onSubmit }) {
  const {
    formState: { isSubmitting },
    register,
    watch,
    setValue,
    handleSubmit,
  } = useForm({ values: { type: "OPENAI" } });
  const type = watch("type");

  return (
    <Container maxWidth="md" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={10}>
        <Text fontSize="lg" fontWeight="bold">
          Select agent type
        </Text>
        <Stack spacing={3}>
          {OPTION_TYPES.map(({ id, name, description }) => (
            <HStack
              key={id}
              borderWidth="0.5px"
              borderRadius="md"
              //backgroundColor="#222"
              padding={4}
              cursor="pointer"
              borderColor={type === id && "orange.500"}
              _hover={{ borderColor: "orange", opacity: 1 }}
              opacity={type === id ? 1 : 0.4}
              onClick={() => setValue("type", id)}
            >
              <Stack spacing={3}>
                <Input
                  type="text"
                  {...register("type", { isRequired: true })}
                  visibility="hidden"
                  width={0}
                  height={0}
                />
                <HStack justifyContent="space-between">
                  <Text fontWeight="bold">{name}</Text>
                  <Tag
                    borderRadius="full"
                    colorScheme={id === "OPENAI" ? "green" : "orange"}
                  >
                    <HStack>
                      <Icon as={id === "OPENAI" ? TbBolt : TbAlertTriangle} />
                      <Text>
                        {id === "OPENAI" ? "Recommended" : "Experimental"}
                      </Text>
                    </HStack>
                  </Tag>
                </HStack>
                <Text color="gray.500">{description}</Text>
              </Stack>
            </HStack>
          ))}
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
