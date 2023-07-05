"use client";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Stack,
  StackDivider,
  Tag,
  Text,
} from "@chakra-ui/react";
import { SUPERAGENT_VERSION } from "../../lib/constants";
import { FOOTER_MENU, MAIN_MENU } from "../../lib/sidebar-menu";
import { TbMenu } from "react-icons/tb";

function MenuLink({ label, icon, path, ...properties }) {
  const pathname = usePathname();
  const isActive = pathname == path;

  return (
    <Box as={path && NextLink} passHref href={path} width="100%">
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
    <>
      <Stack
        display={["flex", "none", "none", "none"]}
        paddingX={6}
        paddingY={4}
        borderBottomWidth="1px"
      >
        <HStack justifyContent="space-between">
          <HStack spacing={4}>
            <Text as="strong" color="white" fontSize="lg">
              Superagent
            </Text>
            <Tag size="sm">{SUPERAGENT_VERSION}</Tag>
          </HStack>
          <Menu>
            <MenuButton>
              <IconButton icon={<Icon as={TbMenu} />} />
            </MenuButton>
            <MenuList>
              {MAIN_MENU.map(({ icon, id, label, path, ...properties }) => (
                <MenuItem key={id} paddingY={0}>
                  <MenuLink
                    width="100%"
                    label={label}
                    icon={icon}
                    path={path}
                    {...properties}
                  />
                </MenuItem>
              ))}
              <MenuDivider />
              {FOOTER_MENU.filter(
                ({ id }) =>
                  process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || id !== "billing"
              ).map(({ icon, id, label, path, ...properties }) => (
                <MenuItem key={id} paddingY={0}>
                  <MenuLink
                    label={label}
                    icon={icon}
                    path={path}
                    {...properties}
                  />
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </HStack>
      </Stack>
      <Stack
        width="250px"
        height="100vh"
        borderRightWidth="1px"
        padding={4}
        divider={<StackDivider />}
        display={["none", "flex", "flex", "flex"]}
      >
        <Stack spacing={4} flex={1} divider={<StackDivider />}>
          <HStack spacing={4}>
            <Text as="strong" color="white" fontSize="lg">
              Superagent
            </Text>
            <Tag size="sm">{SUPERAGENT_VERSION}</Tag>
          </HStack>
          <Stack spacing={0}>
            {MAIN_MENU.map(({ icon, id, label, path, ...properties }) => (
              <MenuLink
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
            <MenuLink
              key={id}
              label={label}
              icon={icon}
              path={path}
              {...properties}
            />
          ))}
        </Stack>
      </Stack>
    </>
  );
}
