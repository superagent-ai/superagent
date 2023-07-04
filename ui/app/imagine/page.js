import { getServerSession } from "next-auth/next";
import { options } from "@/lib/next-auth";
import ImagineClientPage from "./client-page";

export const metadata = {
  title: "Imagine | SuperAgent",
  description: "Create an agent with Natural Language",
};

export default async function ApiTokens() {
  const session = await getServerSession(options);

  return <ImagineClientPage session={session} />;
}
