import ShareClientPage from "./client-page";

export const metadata = {
  title: "Superagent",
  description: "Create AI Agents in seconds",
};

export default async function Share({ searchParams }) {
  const { agentId, token } = searchParams;

  return <ShareClientPage agentId={agentId} token={token} />;
}
