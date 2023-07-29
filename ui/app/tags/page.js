import { getServerSession } from "next-auth/next";
import { options } from "@/lib/next-auth";
import TagsClientPage from "./client-page";
import Api from "@/lib/api";

export const metadata = {
  title: "Tags | Superagent",
  description: "Manage your tags",
};

export default async function Tags() {
  const session = await getServerSession(options);
  const api = new Api(session);
  const tags = await api.getTags();

  return <TagsClientPage data={tags} session={session} />;
}
