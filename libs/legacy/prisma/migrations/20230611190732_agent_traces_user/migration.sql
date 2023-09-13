/*
  Warnings:

  - Added the required column `userId` to the `AgentTrace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AgentTrace" ADD COLUMN     "userId" VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE "AgentTrace" ADD CONSTRAINT "AgentTrace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
