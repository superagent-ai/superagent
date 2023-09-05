"use client"

import NextLink from "next/link"
import { usePathname } from "next/navigation"
import { RxRocket } from "react-icons/rx"

import { siteConfig } from "@/config/site"

import Logo from "./logo"
import { Button } from "./ui/button"

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <div className="flex h-full w-16 flex-col items-center justify-between space-y-6 border-r py-4 align-top">
      <div className="flex flex-col items-center justify-center space-y-4 px-10">
        <Logo />
        <div className="flex flex-col justify-center px-10">
          {siteConfig.mainNav.map((navItem) => (
            <NextLink href={navItem.href} key={navItem.title}>
              <Button
                variant={pathname === navItem.href ? "active" : "ghost"}
                size="icon"
              >
                <navItem.icon size={20} />
              </Button>
            </NextLink>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-center px-10 align-bottom">
        {siteConfig.footerNav.map((navItem) => (
          <NextLink href={navItem.href} key={navItem.title}>
            <Button
              variant={pathname === navItem.href ? "active" : "ghost"}
              size="icon"
            >
              <navItem.icon size={20} />
            </Button>
          </NextLink>
        ))}
      </div>
    </div>
  )
}
