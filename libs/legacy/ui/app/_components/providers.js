"use client";
import { useEffect } from "react";
import { CacheProvider } from "@chakra-ui/next-js";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import { usePrevious } from "react-use";
import { analytics } from "@/lib/analytics";
import { SaasProvider } from "@saas-ui/react";
import glassTheme  from '@/lib/themes/glass'

function AnalyticsProvider({ children }) {
  const pathname = usePathname();
  const session = useSession();
  const previousPathname = usePrevious(pathname);
  const previousSession = usePrevious(session);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
      if (pathname !== previousPathname) {
        analytics.page({ name: pathname });
      }

      if (
        session.status === "authenticated" &&
        previousSession?.status !== "authenticated"
      ) {
        analytics.identify(session.data.user?.user?.id, {
          ...session.data.user.user,
        });
      }
    }
  }, [previousSession, session, pathname, previousPathname]);

  return children;
}

export function Providers({ children }) {
  return (
    <SessionProvider>
      <AnalyticsProvider>
        <CacheProvider>
          <SaasProvider theme={glassTheme}>{children}</SaasProvider>
        </CacheProvider>
      </AnalyticsProvider>
    </SessionProvider>
  );
}
