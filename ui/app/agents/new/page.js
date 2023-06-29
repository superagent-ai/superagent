import { getServerSession } from "next-auth/next";
import { options } from "@/lib/next-auth";
import NewAgentClientPage from "./client-page";

export const metadata = {
  title: "New Agent | Superagent",
  description: "Create new agent",
};

export default async function Agents() {
  const session = await getServerSession(options);

  return <NewAgentClientPage session={session} />;
}
