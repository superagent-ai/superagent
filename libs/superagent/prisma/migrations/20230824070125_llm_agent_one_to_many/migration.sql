/*
  Warnings:

  - You are about to drop the column `llmId` on the `Agent` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Agent" DROP CONSTRAINT "Agent_llmId_fkey";

-- DropIndex
DROP INDEX "Agent_llmId_key";

-- AlterTable
ALTER TABLE "Agent" DROP COLUMN "llmId";

-- AlterTable
ALTER TABLE "LLM" ADD COLUMN     "agentId" TEXT;

-- AddForeignKey
ALTER TABLE "LLM" ADD CONSTRAINT "LLM_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
