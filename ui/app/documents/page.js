import { getServerSession } from "next-auth/next";
import { options } from "@/lib/next-auth";
import DocumentsClientPage from "./client-page";
import Api from "@/lib/api";

export const metadata = {
  title: "Documents | SuperAgent",
  description: "Manage your documents",
};

export default async function ApiTokens() {
  const session = await getServerSession(options);
  const api = new Api(session);
  const documents = await api.getDocuments();

  return <DocumentsClientPage data={documents} session={session} />;
}
