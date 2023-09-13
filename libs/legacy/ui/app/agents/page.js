import { getServerSession } from "next-auth/next";
import { options } from "@/lib/next-auth";
import AgentsClientPage from "./client-page";
import Api from "@/lib/api";

export const metadata = {
  title: "Agents | Superagent",
  description: "Manage your agents",
};

const getData = async (session) => {
  const api = new Api(session);
  return Promise.all([api.getAgents(), api.getTags()]);
};

export default async function Agents() {
  const session = await getServerSession(options);
  const [agents, tags] = await getData(session);

  return <AgentsClientPage data={agents} tags={tags} session={session} />;
}
