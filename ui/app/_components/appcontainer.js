"use client";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Badge,
  Button,
  HStack,
  Icon,
  Spacer,
  Tag,
  Text,
} from "@chakra-ui/react";
import {
  AppShell,
  Sidebar,
  SidebarToggleButton,
  SidebarSection,
  NavItem,
  NavGroup,
} from '@saas-ui/react'
import { SUPERAGENT_VERSION } from "../../lib/constants";
import { FOOTER_MENU, MAIN_MENU } from "../../lib/sidebar-menu";

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
        size="md"
        variant="ghost"
        color={isActive ? "white" : "gray.400"}
      >
        {label}
      </Button>
    </Box>
  );
}

export default function AppBody({ children }) {
  return (
    <AppShell
      variant="fixed"
      minH="100vh"
      maxH="100vh"
      overflow="hidden"
      sidebar={
 
        <Sidebar position="sticky">
          <SidebarToggleButton />
          <SidebarSection direction="row">
          <HStack width="full" justifyContent="space-between">
            {/*<Image
              src="/logo.png"
              width="32"
              height="20"
              boxSize="7"
      /> */}
            <Text as="strong" color="white" fontSize="xl">
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

            <NavGroup title="Tags" isCollapsible>
              <NavItem
                icon={<Badge bg="purple.500" boxSize="2" borderRadius="full" />}
              >
                <Text>Tag Title</Text>
                <Badge opacity="0.6" borderRadius="full" bg="none" ms="auto">
                  83
                </Badge>
              </NavItem>
              <NavItem
                icon={<Badge bg="cyan.500" boxSize="2" borderRadius="full" />}
              >
                <Text>Tag Title</Text>
                <Badge opacity="0.6" borderRadius="full" bg="none" ms="auto">
                  210
                </Badge>
              </NavItem>
            </NavGroup>
          </SidebarSection>
          <SidebarSection>
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
