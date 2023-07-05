import { getServerSession } from "next-auth/next";
import { options } from "@/lib/next-auth";
import ShareClientPage from "./client-page";
import Api from "@/lib/api";

export const metadata = {
  title: "Superagent",
  description: "Create AI Agents in seconds",
};

export default async function Share() {
  const session = await getServerSession(options);
  const api = new Api(session);
  const prompts = await api.getPrompts();

  return <ShareClientPage data={prompts} session={session} />;
}
