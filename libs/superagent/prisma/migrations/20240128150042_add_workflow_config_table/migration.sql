-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "workflowConfigId" TEXT;

-- AlterTable
ALTER TABLE "Datasource" ADD COLUMN     "workflowConfigAgentId" TEXT,
ADD COLUMN     "workflowConfigId" TEXT;

-- AlterTable
ALTER TABLE "Tool" ADD COLUMN     "workflowConfigAgentId" TEXT,
ADD COLUMN     "workflowConfigId" TEXT;

-- CreateTable
CREATE TABLE "WorkflowConfigHistory" (
    "id" TEXT NOT NULL,
    "configFile" JSONB NOT NULL,
    "workflowConfigId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowConfigHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowConfig" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "latestWorkflowConfigHistoryId" TEXT,
    "apiUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowConfig_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_workflowConfigId_fkey" FOREIGN KEY ("workflowConfigId") REFERENCES "WorkflowConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Datasource" ADD CONSTRAINT "Datasource_workflowConfigId_fkey" FOREIGN KEY ("workflowConfigId") REFERENCES "WorkflowConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Datasource" ADD CONSTRAINT "Datasource_workflowConfigAgentId_fkey" FOREIGN KEY ("workflowConfigAgentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_workflowConfigId_fkey" FOREIGN KEY ("workflowConfigId") REFERENCES "WorkflowConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_workflowConfigAgentId_fkey" FOREIGN KEY ("workflowConfigAgentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowConfig" ADD CONSTRAINT "WorkflowConfig_latestWorkflowConfigHistoryId_fkey" FOREIGN KEY ("latestWorkflowConfigHistoryId") REFERENCES "WorkflowConfigHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowConfig" ADD CONSTRAINT "WorkflowConfig_apiUserId_fkey" FOREIGN KEY ("apiUserId") REFERENCES "ApiUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
