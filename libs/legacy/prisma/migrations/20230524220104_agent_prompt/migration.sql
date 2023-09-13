/*
  Warnings:

  - You are about to drop the `Prompts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Prompts" DROP CONSTRAINT "Prompts_userId_fkey";

-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "promptId" VARCHAR(255);

-- DropTable
DROP TABLE "Prompts";

-- CreateTable
CREATE TABLE "Prompt" (
    "id" VARCHAR(255) NOT NULL,
    "name" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "input_variables" JSONB NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Prompt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
