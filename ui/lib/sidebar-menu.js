import {
  TbHome,
  TbKey,
  TbBook,
  TbLogout,
  TbFileText,
  TbBrain,
  TbCreditCard,
  TbCodePlus,
  TbTool,
  TbListSearch,
} from "react-icons/tb";
import { signOut } from "next-auth/react";

const createPortalUrl = async () => {
  const response = await fetch("/api/stripe/portal-link");
  const { data } = await response.json();

  window.location.href = data;
};

export const MAIN_MENU = [
  {
    id: "home",
    label: "Home",
    path: "/",
    icon: TbHome,
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
    id: "prompts",
    label: "Prompts",
    path: "/prompts",
    icon: TbCodePlus,
  },
  {
    id: "documents",
    label: "Documents",
    path: "/documents",
    icon: TbFileText,
  },
  {
    id: "logs",
    label: "Logs",
    path: "/logs",
    icon: TbListSearch,
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
