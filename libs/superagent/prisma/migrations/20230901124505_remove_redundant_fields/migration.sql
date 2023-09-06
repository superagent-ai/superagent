/*
  Warnings:

  - You are about to drop the column `datasourceId` on the `AgentTool` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AgentTool" DROP CONSTRAINT "AgentTool_datasourceId_fkey";

-- AlterTable
ALTER TABLE "AgentTool" DROP COLUMN "datasourceId";
