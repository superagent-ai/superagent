-- DropForeignKey
ALTER TABLE "WorkflowStep" DROP CONSTRAINT "WorkflowStep_agentId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowStep" DROP CONSTRAINT "WorkflowStep_workflowId_fkey";

-- AddForeignKey
ALTER TABLE "WorkflowStep" ADD CONSTRAINT "WorkflowStep_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowStep" ADD CONSTRAINT "WorkflowStep_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
