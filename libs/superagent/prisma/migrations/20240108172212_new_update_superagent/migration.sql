/*
  Warnings:

  - The values [HTTP] on the enum `ToolType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `vectorDbId` on the `Datasource` table. All the data in the column will be lost.
  - You are about to drop the column `apiUserId` on the `LLM` table. All the data in the column will be lost.
  - You are about to drop the column `toolConfig` on the `Tool` table. All the data in the column will be lost.
  - You are about to drop the `VectorDb` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `input` on table `WorkflowStep` required. This step will fail if there are existing NULL values in that column.
  - Made the column `output` on table `WorkflowStep` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ToolType_new" AS ENUM ('ALGOLIA', 'BROWSER', 'BING_SEARCH', 'REPLICATE', 'WOLFRAM_ALPHA', 'ZAPIER_NLA', 'AGENT', 'OPENAPI', 'CHATGPT_PLUGIN', 'METAPHOR', 'PUBMED', 'CODE_EXECUTOR', 'OPENBB', 'GPT_VISION', 'TTS_1', 'HAND_OFF', 'FUNCTION');
ALTER TABLE "Tool" ALTER COLUMN "type" TYPE "ToolType_new" USING ("type"::text::"ToolType_new");
ALTER TYPE "ToolType" RENAME TO "ToolType_old";
ALTER TYPE "ToolType_new" RENAME TO "ToolType";
DROP TYPE "ToolType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Datasource" DROP CONSTRAINT "Datasource_vectorDbId_fkey";

-- DropForeignKey
ALTER TABLE "LLM" DROP CONSTRAINT "LLM_apiUserId_fkey";

-- DropForeignKey
ALTER TABLE "VectorDb" DROP CONSTRAINT "VectorDb_apiUserId_fkey";

-- AlterTable
ALTER TABLE "Datasource" DROP COLUMN "vectorDbId";

-- AlterTable
ALTER TABLE "LLM" DROP COLUMN "apiUserId";

-- AlterTable
ALTER TABLE "Tool" DROP COLUMN "toolConfig";

-- AlterTable
ALTER TABLE "WorkflowStep" ALTER COLUMN "input" SET NOT NULL,
ALTER COLUMN "output" SET NOT NULL;

-- DropTable
DROP TABLE "VectorDb";

-- DropEnum
DROP TYPE "VectorDbProvider";

-- CreateTable
CREATE TABLE "Count" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "queryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Count_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "agentToken" TEXT NOT NULL,
    "userToken" TEXT NOT NULL,
    "apiUserChatwoot" TEXT NOT NULL,
    "apiUserId" TEXT NOT NULL,
    "isAgentActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Count_agentId_key" ON "Count"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "Token_agentToken_key" ON "Token"("agentToken");

-- CreateIndex
CREATE UNIQUE INDEX "Token_userToken_key" ON "Token"("userToken");

-- CreateIndex
CREATE UNIQUE INDEX "Token_apiUserChatwoot_key" ON "Token"("apiUserChatwoot");

-- AddForeignKey
ALTER TABLE "Count" ADD CONSTRAINT "Count_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_apiUserId_fkey" FOREIGN KEY ("apiUserId") REFERENCES "ApiUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
