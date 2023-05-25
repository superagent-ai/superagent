-- DropForeignKey
ALTER TABLE "Agent" DROP CONSTRAINT "Agent_documentId_fkey";

-- DropForeignKey
ALTER TABLE "Agent" DROP CONSTRAINT "Agent_promptId_fkey";

-- DropForeignKey
ALTER TABLE "AgentMemory" DROP CONSTRAINT "AgentMemory_agentId_fkey";

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentMemory" ADD CONSTRAINT "AgentMemory_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
