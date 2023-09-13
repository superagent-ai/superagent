import React, { useState } from "react";
import {
  Box,
  Button,
  HStack,
  Stack,
  StackDivider,
  useColorModeValue,
} from "@chakra-ui/react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { xcodeDark } from "@uiw/codemirror-theme-xcode";

export default function CodeBlock({ items }) {
  const [item, setItem] = useState(items[0].id);
  const backgroundColor = useColorModeValue("#131416", "#131416");

  return (
    <Stack
      borderWidth="1px"
      fontSize="sm"
      borderRadius="md"
      divider={<StackDivider />}
      spacing={0}
      overflow="hidden"
    >
      <HStack padding={2} backgroundColor={backgroundColor}>
        {items.map(({ id, label }) => (
          <Button
            key={`codenav-${id}`}
            variant="ghost"
            isActive={item === id}
            size="xs"
            onClick={() => setItem(id)}
          >
            {label}
          </Button>
        ))}
      </HStack>
      <Box>
        <CodeMirror
          editable={false}
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
          ]}
          theme={xcodeDark}
          value={items.find(({ id }) => id === item).code}
        />
      </Box>
    </Stack>
  );
}
