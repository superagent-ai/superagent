import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import { Globe, Github, MessageCircle } from "lucide-react";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image
            src="/logo.jpg"
            width={25}
            height={25}
            alt="Superagent Logo"
            className="rounded-md border"
          />
          Superagent
        </>
      ),
    },
    // see https://fumadocs.dev/docs/ui/navigation/links
    links: [
      {
        text: "Website",
        url: "https://superagent.sh",
        icon: <Globe className="size-4" />,
      },
      {
        text: "GitHub",
        url: "https://github.com/superagent-ai/superagent",
        icon: <Github className="size-4" />,
      },
      {
        text: "Discord",
        url: "https://discord.gg/spZ7MnqFT4",
        icon: <MessageCircle className="size-4" />,
      },
    ],
  };
}
