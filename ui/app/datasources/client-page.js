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
import Webpages from "./_components/webpages";
import Applications from "./_components/applications";
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
            Upload files or connect third-party apps and use them in your
            agents.
          </Text>
        </Stack>
      </HStack>
      <Tabs colorScheme="gray">
        <TabList>
          <Tab>Files</Tab>
          <Tab>Webpages</Tab>
          <Tab>Applications</Tab>
        </TabList>
        <TabPanels>
          <TabPanel paddingX={0}>
            <Files data={data} session={session} />
          </TabPanel>
          <TabPanel paddingX={0}>
            <Webpages data={data} session={session} />
          </TabPanel>
          <TabPanel paddingX={0}>
            <Applications data={data} session={session} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
}
