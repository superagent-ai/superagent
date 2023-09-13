"use client";
import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Heading,
  HStack,
  Stack,
  Table,
  Tbody,
  Tr,
  Td,
  Text,
  StackDivider,
  Tag,
  IconButton,
  Icon,
  useColorMode,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import titleize from "titleize";
import { TbX } from "react-icons/tb";

export default function LogsClientPage({ data, session }) {
  const [activeLog, setActiveLog] = useState();
  const {colorMode } = useColorMode()

  return (
    <Stack flex={1} paddingTop={12} spacing={6} overflow="auto">
      <Stack paddingX={12}>
        <Heading as="h1" fontSize="2xl">
          Logs
        </Heading>
        <Text color="gray.400">Inspect the your Agents behaviour.</Text>
      </Stack>
      <HStack
        flex={1}
        alignItems="flex-start"
        borderTopWidth="1px"
        spacing={0}
        divider={<StackDivider />}
      >
        <Stack spacing={4} width="100%">
          <Table variant="simple">
            <Tbody>
              {data?.map(({ id, createdAt, agent }) => (
                <Tr
                  key={id}
                  cursor="pointer"
                  
                  //color={activeLog == id && 'primary.500'}
                  _hover={{ opacity: 0.5 }}
                  transition="0.2s all"
                  onClick={() =>
                    setActiveLog(data.find(({ id: logId }) => logId === id))
                  }
                >
                  <Td paddingLeft={12} color={activeLog?.id === id && 'primary.500'}>{agent.name}</Td>
                  <Td color={activeLog?.id === id && 'primary.500'}>{id}</Td>
                  <Td color={activeLog?.id === id && 'primary.500'}>{dayjs(createdAt).format("YYYY-MM-DD, HH:mm")}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Stack>
        {activeLog && (
          <Stack width="70%" divider={<StackDivider />} spacing={0}>
            <HStack paddingY={2.5} justifyContent="space-between">
              <Text paddingX={4}>
                Log{" "}
                <Tag color="gray.500" variant="ghost">
                  /agents/{activeLog.id}/predict
                </Tag>
              </Text>
              <IconButton
                onClick={() => setActiveLog()}
                variant="ghost"
                size="sm"
                icon={<Icon as={TbX} />}
              />
            </HStack>
            <Box
              maxHeight="200px"
              overflow="auto"
              margin={4}
              padding={2}
              backgroundColor={colorMode === 'dark' ? "gray.900" : "gray.100"}
              borderRadius="md"
            >
              <Text fontSize="xs" color="gray.500">
                Output
              </Text>
              <Text marginTop={2} flex={0.8}>
                {activeLog.data.output}
              </Text>
            </Box>
            <Accordion defaultIndex={0}>
              {activeLog.data?.steps.map((log, index) => (
                <AccordionItem key={index}>
                  <h2>
                    <AccordionButton _expanded={{ bg: "gray.900" }}>
                      <Box as="span" flex="1" textAlign="left">
                        Agent step {index + 1}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>

                  <AccordionPanel pb={4}>
                    <Stack flex={1}>
                      {Object.entries(log).map(([key, value]) => {
                        const getColor = () => {
                          if (key === "observation") {
                            return "yellow";
                          }

                          if (key === "input") {
                            return "pink";
                          }

                          if (key === "action") {
                            return "orange";
                          }

                          return "gray.400";
                        };

                        return (
                          <Box key={key} padding={2} fontSize="sm">
                            <HStack
                              alignItems="flex-start"
                              justifyContent="space-between"
                            >
                              <Text flex={0.2}>{titleize(key)}</Text>
                              <Box overflow="auto" flex={0.8} maxHeight="250px">
                                <Text
                                  color={getColor()}
                                  fontFamily="monospace"
                                  borderRadius="md"
                                  padding={2}
                                  backgroundColor="gray.900"
                                >
                                  {JSON.stringify(value)}
                                </Text>
                              </Box>
                            </HStack>
                          </Box>
                        );
                      })}
                    </Stack>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Stack>
        )}
      </HStack>
    </Stack>
  );
}
