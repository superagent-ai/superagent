-- DropForeignKey
ALTER TABLE "AgentDatasource" DROP CONSTRAINT "AgentDatasource_agentId_fkey";

-- DropForeignKey
ALTER TABLE "AgentLLM" DROP CONSTRAINT "AgentLLM_agentId_fkey";

-- DropForeignKey
ALTER TABLE "AgentTool" DROP CONSTRAINT "AgentTool_agentId_fkey";

-- AddForeignKey
ALTER TABLE "AgentDatasource" ADD CONSTRAINT "AgentDatasource_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentTool" ADD CONSTRAINT "AgentTool_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentLLM" ADD CONSTRAINT "AgentLLM_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
