/*
  Warnings:

  - The primary key for the `WorkflowLLM` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `worflowId` on the `WorkflowLLM` table. All the data in the column will be lost.
  - Added the required column `workflowId` to the `WorkflowLLM` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WorkflowLLM" DROP CONSTRAINT "WorkflowLLM_worflowId_fkey";

-- AlterTable
ALTER TABLE "WorkflowLLM" DROP CONSTRAINT "WorkflowLLM_pkey",
DROP COLUMN "worflowId",
ADD COLUMN     "workflowId" TEXT NOT NULL,
ADD CONSTRAINT "WorkflowLLM_pkey" PRIMARY KEY ("workflowId", "llmId");

-- AddForeignKey
ALTER TABLE "WorkflowLLM" ADD CONSTRAINT "WorkflowLLM_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
