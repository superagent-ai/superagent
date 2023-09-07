import { GoWorkflow } from "react-icons/go"
import { PiDatabase } from "react-icons/pi"
import {
  RxAvatar,
  RxChatBubble,
  RxDiscordLogo,
  RxFileText,
  RxGithubLogo,
  RxGlobe,
  RxRocket,
} from "react-icons/rx"

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Superagent Cloud",
  description: "The agent framework for large language models",
  mainNav: [
    {
      title: "Agents",
      href: "/agents",
      icon: RxRocket,
    },
    {
      title: "worflows",
      href: "/worflows",
      icon: GoWorkflow,
    },
    {
      title: "datasources",
      href: "/datasources",
      icon: PiDatabase,
    },
    {
      title: "apis",
      href: "/apis",
      icon: RxGlobe,
    },
    {
      title: "llms",
      href: "/llms",
      icon: RxChatBubble,
    },
  ],
  footerNav: [
    {
      title: "Discord",
      href: "https://discord.com/invite/mhmJUTjW4b",
      icon: RxDiscordLogo,
    },
    {
      title: "Github",
      href: "https://github.com/homanp/superagent",
      icon: RxGithubLogo,
    },
    {
      title: "Documentation",
      href: "https://docs.superagent.sh",
      icon: RxFileText,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: RxAvatar,
    },
  ],
  settingsNav: [
    {
      title: "User",
      href: "/settings",
    },
    {
      title: "Api keys",
      href: "/settings/api-keys",
    },
    {
      title: "Appearance",
      href: "/settings/appearance",
    },
    {
      title: "Billing",
      href: "/settings/billing",
      disabled: true,
    },
  ],
  llms: [
    {
      id: "OPENAI",
      description:
        "Power your agents with the latest models from OpenAI, powerful for calling external APIs and reasoning.",
      name: "OpenAI",
      logo: "/openai-logo.png",
      options: [
        {
          value: "GPT_3_5_TURBO_16K_0613",
          title: "gpt-3.5-turbo-16k-0613",
        },
        {
          value: "GPT_3_5_TURBO_0613",
          title: "gpt-3.5-turbo-16k-0613",
        },
        {
          value: "GPT_4_32K_0613",
          title: "gpt-4-32k-0613",
        },
        {
          value: "GPT_4_0613",
          title: "gpt-4-0613",
        },
      ],
    },
    {
      disabled: true,
      id: "META",
      description:
        "Use Meta's latest models such as Llama and Llama 2 to power your agents. An open source alternative to OpenAI.",
      name: "Meta",
      logo: "/meta-logo.png",
      options: [
        {
          value: "LLAMA",
          title: "Llama",
        },
      ],
    },
  ],
}
