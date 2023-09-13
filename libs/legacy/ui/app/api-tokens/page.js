import { getServerSession } from "next-auth/next";
import { options } from "@/lib/next-auth";
import ApiTokensClientPage from "./client-page";
import Api from "@/lib/api";

export const metadata = {
  title: "Api tokens | Superagent",
  description: "Manage your api tokens",
};

export default async function ApiTokens() {
  const session = await getServerSession(options);
  const api = new Api(session);
  const apiTokens = await api.getApiTokens();

  return <ApiTokensClientPage data={apiTokens} session={session} />;
}
