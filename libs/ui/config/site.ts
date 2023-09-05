export type SiteConfig = typeof siteConfig
import {RxRocket, RxGlobe, RxGithubLogo, RxAvatar, RxFileText, RxDiscordLogo} from "react-icons/rx"
import {GoWorkflow} from "react-icons/go"
import {PiDatabase} from "react-icons/pi"

export const siteConfig = {
  name: "Superagent Cloud",
  description:
    "The agent framework for large language models",
  mainNav: [
    {
      title: "Agents",
      href: "/agents",
      icon: RxRocket
    },
    {
      title: "worflows",
      href: "/worflows",
      icon: GoWorkflow
    },
    {
      title: "datasources",
      href: "/datasources",
      icon: PiDatabase
    },
    {
      title: "apis",
      href: "/apis",
      icon: RxGlobe
    }
  ],
  footerNav: [
    {
      title: "Discord",
      href: "https://discord.com/invite/mhmJUTjW4b",
      icon: RxDiscordLogo
    },
    {
      title: "Github",
      href: "https://github.com/homanp/superagent",
      icon: RxGithubLogo
    },
    {
      title: "Documentation",
      href: "https://docs.superagent.sh",
      icon: RxFileText
    },
    {
      title: "Settings",
      href: "/settings",
      icon: RxAvatar,
    }
  ]
}
