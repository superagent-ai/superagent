"use client";
import {
  Heading,
  HStack,
  Stack,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import Files from "./_components/files";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function DatasourceClientPage({ data, session }) {
  return (
    <Stack
      flex={1}
      paddingX={[6, 12]}
      paddingY={12}
      spacing={6}
      overflow="auto"
    >
      <HStack justifyContent="space-between" spacing={12}>
        <Stack>
          <Heading as="h1" fontSize="2xl">
            Datasources
          </Heading>
          <Text color="gray.400" display={["none", "block"]}>
            Upload documents and use them to do question answering.
          </Text>
        </Stack>
      </HStack>
      <Tabs colorScheme="gray">
        <TabList>
          <Tab>Files</Tab>
          <Tab>Webpages</Tab>
          <Tab>Connectors</Tab>
        </TabList>
        <TabPanels>
          <TabPanel paddingX={0}>
            <Files data={data} session={session} />
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
}
