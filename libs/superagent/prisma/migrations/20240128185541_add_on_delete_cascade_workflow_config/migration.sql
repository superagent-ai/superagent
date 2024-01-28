-- DropForeignKey
ALTER TABLE "AgentDatasource" DROP CONSTRAINT "AgentDatasource_datasourceId_fkey";

-- DropForeignKey
ALTER TABLE "AgentTool" DROP CONSTRAINT "AgentTool_toolId_fkey";

-- DropForeignKey
ALTER TABLE "Datasource" DROP CONSTRAINT "Datasource_workflowConfigAgentId_fkey";

-- DropForeignKey
ALTER TABLE "Datasource" DROP CONSTRAINT "Datasource_workflowConfigId_fkey";

-- DropForeignKey
ALTER TABLE "Tool" DROP CONSTRAINT "Tool_workflowConfigAgentId_fkey";

-- DropForeignKey
ALTER TABLE "Tool" DROP CONSTRAINT "Tool_workflowConfigId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowConfig" DROP CONSTRAINT "WorkflowConfig_latestWorkflowConfigHistoryId_fkey";

-- AddForeignKey
ALTER TABLE "Datasource" ADD CONSTRAINT "Datasource_workflowConfigId_fkey" FOREIGN KEY ("workflowConfigId") REFERENCES "WorkflowConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Datasource" ADD CONSTRAINT "Datasource_workflowConfigAgentId_fkey" FOREIGN KEY ("workflowConfigAgentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentDatasource" ADD CONSTRAINT "AgentDatasource_datasourceId_fkey" FOREIGN KEY ("datasourceId") REFERENCES "Datasource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_workflowConfigId_fkey" FOREIGN KEY ("workflowConfigId") REFERENCES "WorkflowConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_workflowConfigAgentId_fkey" FOREIGN KEY ("workflowConfigAgentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentTool" ADD CONSTRAINT "AgentTool_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowConfigHistory" ADD CONSTRAINT "WorkflowConfigHistory_workflowConfigId_fkey" FOREIGN KEY ("workflowConfigId") REFERENCES "WorkflowConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
