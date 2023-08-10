import {
  TbKey,
  TbBook,
  TbLogout,
  TbDatabasePlus,
  TbBrain,
  TbCreditCard,
  TbCodePlus,
  TbTool,
  TbListSearch,
  TbBolt,
  TbTag,
} from "react-icons/tb";
import { signOut } from "next-auth/react";

const createPortalUrl = async () => {
  const response = await fetch("/api/stripe/portal-link");
  const { data } = await response.json();

  window.location.href = data;
};

export const MAIN_MENU = [
  {
    id: "library",
    label: "Library",
    path: "/",
    icon: TbBolt,
  },
  {
    id: "agents",
    label: "Agents",
    path: "/agents",
    icon: TbBrain,
  },
  {
    id: "tools",
    label: "Tools",
    path: "/tools",
    icon: TbTool,
  },
  {
    id: "datasources",
    label: "Datasources",
    path: "/datasources",
    icon: TbDatabasePlus,
  },
  {
    id: "prompts",
    label: "Prompts",
    path: "/prompts",
    icon: TbCodePlus,
  },
  {
    id: "logs",
    label: "Logs",
    path: "/logs",
    icon: TbListSearch,
  },
  {
    id: "tags",
    label: "Tags",
    path: "/tags",
    icon: TbTag,
  },
  {
    id: "api_tokens",
    label: "API tokens",
    path: "/api-tokens",
    icon: TbKey,
  },
];

export const FOOTER_MENU = [
  {
    id: "billing",
    label: "Billing",
    path: null,
    onClick: () => createPortalUrl(),
    icon: TbCreditCard,
  },
  {
    id: "docs",
    label: "Documentation",
    path: "https://docs.superagent.sh",
    icon: TbBook,
  },
  {
    id: "api_tokens",
    label: "Sign out",
    path: null,
    onClick: () => signOut({ callbackUrl: "/" }),
    icon: TbLogout,
  },
];
