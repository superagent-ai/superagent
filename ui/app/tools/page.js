import { getServerSession } from "next-auth/next";
import { options } from "@/lib/next-auth";
import ToolsClientPage from "./client-page";
import Api from "@/lib/api";

export const metadata = {
  title: "Tools | Superagent",
  description: "Manage your tools",
};

export default async function Agents() {
  const session = await getServerSession(options);
  const api = new Api(session);
  const tools = await api.getTools();

  return <ToolsClientPage data={tools} session={session} />;
}
