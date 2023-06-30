import HomeClientPage from "./client-page";
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: "Home | Superagent",
  description: "Build, deploy and manage AI Agents in seconds",
};

export default async function Dashboard() {
  return (
  <>
    <Analytics />
    <HomeClientPage />
  </>
  );
}
