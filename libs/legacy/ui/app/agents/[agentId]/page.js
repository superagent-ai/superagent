import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { options } from "@/lib/next-auth";
import AgentDetailClientPage from "./client-page";

export const metadata = {
  title: "Agent | Superagent",
  description: "Run your agent",
};

export default async function AgentDetail({ params }) {
  const { agentId } = params;
  const session = await getServerSession(options);

  return <AgentDetailClientPage id={agentId} session={session} />;
}
