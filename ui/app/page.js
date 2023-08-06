import { getServerSession } from "next-auth/next";
import { options } from "@/lib/next-auth";
import Api from "@/lib/api";
import LibraryClientPage from "./client-page";

export const metadata = {
  title: "Library | Superagent",
  description: "Build, deploy and manage AI Agents in seconds",
};

const getData = async (session) => {
  const api = new Api(session);
  return Promise.all([api.getLibrary()]);
};

export default async function Dashboard() {
  const session = await getServerSession(options);
  const [library] = await getData(session);
  return <LibraryClientPage data={library} />;
}
