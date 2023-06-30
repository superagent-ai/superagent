import { getServerSession } from "next-auth/next";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import { Providers } from "./_components/providers";
import Container from "./_components/container";
import Sidebar from "./_components/sidebar";
import { options } from "@/lib/next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Aidosys",
  description: "LLM agents for education",
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
            {session && <Sidebar />}

            {children}
          </Container>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
