/*
  Warnings:

  - You are about to drop the `WorkflowLLM` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkflowLLM" DROP CONSTRAINT "WorkflowLLM_llmId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowLLM" DROP CONSTRAINT "WorkflowLLM_workflowId_fkey";

-- DropTable
DROP TABLE "WorkflowLLM";
