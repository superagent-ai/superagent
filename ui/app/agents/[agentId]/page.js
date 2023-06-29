import { getServerSession } from "next-auth/next";
import { options } from "@/lib/next-auth";
import AgentDetailClientPage from "./client-page";
import API from "@/lib/api";

export const metadata = {
  title: "Agent | Superagent",
  description: "Run your agent",
};

const getData = async (session, agentId) => {
  const api = new API(session);

  return Promise.all([
    api.getApiTokens(),
    api.getAgentById(agentId),
    api.getAgentDocuments(agentId),
    api.getAgentTools(agentId),
  ]);
};

export default async function AgentDetail({ params }) {
  const { agentId } = params;
  const session = await getServerSession(options);
  const [apiTokens, agent, documents, tools] = await getData(session, agentId);

  return (
    <AgentDetailClientPage
      id={agentId}
      agent={agent}
      apiTokens={apiTokens}
      documents={documents}
      tools={tools}
      session={session}
    />
  );
}
