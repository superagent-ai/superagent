/*
  Warnings:

  - You are about to drop the column `agentId` on the `LLM` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LLM" DROP CONSTRAINT "LLM_agentId_fkey";

-- AlterTable
ALTER TABLE "LLM" DROP COLUMN "agentId";

-- CreateTable
CREATE TABLE "AgentLLM" (
    "agentId" TEXT NOT NULL,
    "llmId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentLLM_pkey" PRIMARY KEY ("agentId","llmId")
);

-- AddForeignKey
ALTER TABLE "AgentLLM" ADD CONSTRAINT "AgentLLM_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentLLM" ADD CONSTRAINT "AgentLLM_llmId_fkey" FOREIGN KEY ("llmId") REFERENCES "LLM"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
