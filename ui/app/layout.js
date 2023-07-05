import { getServerSession } from "next-auth/next";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import { Providers } from "./_components/providers";
import Container from "./_components/container";
import Navigation from "./_components/navigation";
import { options } from "@/lib/next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Superagent",
  description: "Build, deploy and manage AI Agents in seconds",
  openGraph: {
    images: ["/og-image.png"],
  },
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(options);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Container>
            {session && <Navigation />}

            {children}
          </Container>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
