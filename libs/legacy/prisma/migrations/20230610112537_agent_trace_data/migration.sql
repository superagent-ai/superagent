/*
  Warnings:

  - You are about to drop the column `intermediateSteps` on the `AgentTrace` table. All the data in the column will be lost.
  - Added the required column `data` to the `AgentTrace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AgentTrace" DROP COLUMN "intermediateSteps",
ADD COLUMN     "data" JSONB NOT NULL;
