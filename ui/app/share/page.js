import ky from "ky";
import ShareClientPage from "./client-page";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Superagent",
  description: "Create AI Agents in seconds",
};

const getAgent = async (agentId, token) =>
  ky
    .get(`${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/agents/${agentId}`, {
      headers: { authorization: `Bearer ${token}` },
    })
    .json();

export default async function Share({ searchParams }) {
  const { agentId, token } = searchParams;
  const { data: agent } = await getAgent(agentId, token);

  if (!agent.isPublic) {
    redirect("/login");
  }

  return <ShareClientPage agentId={agentId} token={token} />;
}
