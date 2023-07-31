"use client";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Button,
  HStack,
  Icon,
  Spacer,
  Tag,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import {
  AppShell,
  Sidebar,
  SidebarToggleButton,
  SidebarSection,
  NavGroup,
} from '@saas-ui/react'
import { SUPERAGENT_VERSION } from "../../lib/constants";
import { FOOTER_MENU, MAIN_MENU } from "../../lib/sidebar-menu";
import { TbMoon, TbSun } from "react-icons/tb";

function MenuLink({ label, icon, path, ...properties }) {
  const pathname = usePathname();
  const isActive = pathname == path;

  return (
    <Box as={path && NextLink} passHref href={path} width="100%">
      <Button
        as="p"
        {...properties}
        isActive={isActive}
        leftIcon={<Icon as={icon} />}
        width="full"
        justifyContent="flex-start"
        fontWeight="500"
        marginY={"0.5"}
        size="md"
        variant="ghost"
        opacity={isActive ? "1": "0.7"}
      >
        {label}
      </Button>
    </Box>
  );
}

export default function AppBody({ children, session }) {
  const { toggleColorMode, colorMode } = useColorMode()
  return (
    <AppShell
      variant="fixed"
      minH="100vh"
      maxH="100vh"
      overflow="hidden"
      sidebar={
        session &&
        <Sidebar>
          <SidebarToggleButton />
          <SidebarSection direction="row">
          <HStack width="full" justifyContent="space-between" paddingX="2">
            <Text as="strong" fontSize="2xl">
              Superagent
            </Text>
            <Spacer />
            <Tag size="sm">{SUPERAGENT_VERSION}</Tag>
            </HStack>
          </SidebarSection>
          <SidebarSection flex="1" overflowY="auto" paddingTop={2}>
            <NavGroup>
            {MAIN_MENU.map(({ icon, id, label, path, ...properties }) => (
              <MenuLink
                key={id}
                label={label}
                icon={icon}
                path={path}
                {...properties}
              />
            ))}
            </NavGroup>

          </SidebarSection>
          <SidebarSection>
          <MenuLink
            onClick={(e) => {
              e.preventDefault()
              toggleColorMode()
            }}
            icon={colorMode === 'dark' ? TbSun : TbMoon}
            label={colorMode === 'dark' ? 'Light mode' : 'Dark mode'}
          />
          {FOOTER_MENU.filter(
                ({ id }) =>
                  process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || id !== "billing"
              ).map(({ icon, id, label, path, ...properties }) => (
                  <MenuLink
                    label={label}
                    icon={icon}
                    path={path}
                    {...properties}
                  />
              ))}
          </SidebarSection>
        </Sidebar>
      }
      >
        <Box as="main" flex="1" overflowY="auto">
          {children}
        </Box>
      </AppShell>
  );
}
