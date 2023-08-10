import ky from "ky";
import ShareClientPage from "./client-page";
import { redirect } from "next/navigation";
import crypto from "crypto";

export const metadata = {
  title: "Superagent",
  description: "Create AI Agents in seconds",
};

const algorithm = "aes-128-cbc";
const key = process.env.NEXT_PUBLIC_SHARABLE_KEY_SECRET;

const decryptToken = (token) => {
  const iv = Buffer.from(token.slice(0, 32), "hex");
  const ciphertext = token.slice(32);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decryptedData = decipher.update(ciphertext, "hex", "utf8");
  decryptedData += decipher.final("utf8");
  return decryptedData;
};

const getAgent = async (agentId, token) =>
  ky
    .get(`${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/agents/${agentId}`, {
      headers: { authorization: `Bearer ${token}` },
    })
    .json();

export default async function Share({ searchParams }) {
  const { agentId, token } = searchParams;
  const apiToken = decryptToken(token);
  const { data: agent } = await getAgent(agentId, apiToken);

  if (!agent.isPublic && !agent.isListed) {
    redirect("/login");
  }

  return <ShareClientPage agent={agent} token={apiToken} />;
}
