import { getServerSession } from "next-auth/next";
import { options } from "@/lib/next-auth";
import LogsClientPage from "./client-page";
import Api from "@/lib/api";

export const metadata = {
  title: "Logs | Superagent",
  description: "Manage your logs",
};

export default async function Logs() {
  const session = await getServerSession(options);
  const api = new Api(session);
  const logs = await api.getLogs();

  return <LogsClientPage data={logs} session={session} />;
}
