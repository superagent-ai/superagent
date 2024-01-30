import "@/styles/globals.css"
import { Metadata } from "next"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"

import Container from "./container"
import { ChatsAppAI } from "@/components/svg/ChatsAppAI"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/android-chrome-192x192.png",
    apple: "/android-chrome-192x192.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export const dynamic = "force-dynamic"

export default async function RootLayout({ children }: RootLayoutProps) {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    return (
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "bg-background min-h-screen font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen flex-col overflow-hidden">
              <div className="flex-1">
                <Container session={session}>{children}</Container>
              </div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    );
  } else {
    return (
      <>
        <html lang="en" suppressHydrationWarning>
          <head />
          <body
            className={cn(
              "bg-background min-h-screen font-sans antialiased",
              fontSans.variable
            )}
          >
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div className="relative flex min-h-screen flex-col overflow-hidden">
                <div className="flex flex-1">
                  <div className="bg-white-100 flex w-1/2 flex-col justify-between border-r-2 border-white p-2 md:p-10">
                    <ChatsAppAI/>
                    <p className="w-[80%]">“Los Agentes de IA nos ahorraron mas de 1000 horas de trabajo manual en solo un mes, una locura para una empresa como la nuestra.”Martin David</p>
                  </div>
                  <div className="w-1/2">
                    <Container session={session}>{children}</Container>
                  </div>
                </div>
              </div>
            </ThemeProvider>
          </body>
        </html>
      </>
    );
  }
}
