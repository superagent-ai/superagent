import localforage from "localforage";
import { v4 as uuidv4 } from "uuid";

export const useShareSession = ({ agent }) => {
  const createSession = async () => {
    const payload = { name: "New chat!", id: uuidv4(), created_at: new Date() };
    const sessions = await localforage.getItem("sa-share-session");

    await localforage.setItem("sa-share-session", [
      ...sessions,
      { agent_id: agent.id, ...payload },
    ]);

    return payload;
  };

  const getSessions = async () => {
    const sessions = await localforage.getItem("sa-share-session");
    const filteredSessions = sessions.filter(
      ({ agent_id }) => agent_id === agent.id
    );

    if (filteredSessions.length === 0) {
      return localforage.setItem("sa-share-session", [
        {
          name: "New chat!",
          id: uuidv4(),
          created_at: new Date(),
          updated_at: new Date(),
          agent_id: agent.id,
        },
      ]);
    }

    return filteredSessions;
  };

  const updateSession = async (id, payload) => {
    let sessions = await localforage.getItem("sa-share-session");
    let updatedSession = null;

    const updatedSessions = sessions.map((session) => {
      if (session.id === id) {
        updatedSession = {
          ...session,
          ...payload,
        };
        return updatedSession;
      }
      return session;
    });

    if (!updatedSession) {
      return null;
    }

    await localforage.setItem("sa-share-session", updatedSessions);

    return updatedSession;
  };

  return { getSessions, updateSession, createSession };
};
