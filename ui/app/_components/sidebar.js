"use client";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Button,
  HStack,
  Icon,
  Stack,
  StackDivider,
  Tag,
  Text,
} from "@chakra-ui/react";
import { SUPERAGENT_VERSION } from "../../lib/constants";
import { FOOTER_MENU, MAIN_MENU } from "../../lib/sidebar-menu";

function MenuButton({ label, icon, path, ...properties }) {
  const pathname = usePathname();
  const isActive = pathname == path;

  return (
    <Box as={path && NextLink} passHref href={path}>
      <Button
        {...properties}
        isActive={isActive}
        leftIcon={<Icon as={icon} />}
        width="full"
        justifyContent="flex-start"
        fontWeight="500"
        variant="ghost"
        color={isActive ? "white" : "gray.400"}
      >
        {label}
      </Button>
    </Box>
  );
}

export default function Sidebar() {
  return (
    <Stack
      width="250px"
      height="100vh"
      borderRightWidth="1px"
      padding={4}
      divider={<StackDivider />}
    >
      <Stack spacing={4} flex={1} divider={<StackDivider />}>
        <HStack spacing={4}>
          <Text as="strong" color="white" fontSize="lg">
            Aidosys
          </Text>
          <Tag size="sm">{SUPERAGENT_VERSION}</Tag>
        </HStack>
        <Stack spacing={0}>
          {MAIN_MENU.map(({ icon, id, label, path, ...properties }) => (
            <MenuButton
              key={id}
              label={label}
              icon={icon}
              path={path}
              {...properties}
            />
          ))}
        </Stack>
      </Stack>
      <Stack spacing={0}>
        {FOOTER_MENU.filter(
          ({ id }) =>
            process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || id !== "billing"
        ).map(({ icon, id, label, path, ...properties }) => (
          <MenuButton
            key={id}
            label={label}
            icon={icon}
            path={path}
            {...properties}
          />
        ))}
      </Stack>
    </Stack>
  );
}
