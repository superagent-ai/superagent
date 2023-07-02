"use client";
import { useEffect } from "react";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import { usePrevious } from "react-use";
import theme from "@/lib/theme";
import { analytics } from "@/lib/analytics";

function AnalyticsProvider({ children }) {
  const pathname = usePathname();
  const session = useSession();
  const previousPathname = usePrevious(pathname);
  const previousSession = usePrevious(session);

  useEffect(() => {
    if (pathname !== previousPathname) {
      analytics.page({ name: pathname });
    }

    if (
      session.status === "authenticated" &&
      previousSession?.status !== "authenticated"
    ) {
      analytics.identify(session.data.user.user.id, {
        ...session.data.user.user,
      });
    }
  }, [previousSession, session, pathname, previousPathname]);

  return children;
}

export function Providers({ children }) {
  return (
    <SessionProvider>
      <AnalyticsProvider>
        <CacheProvider>
          <ChakraProvider theme={theme}>{children}</ChakraProvider>
        </CacheProvider>
      </AnalyticsProvider>
    </SessionProvider>
  );
}
