/*
  Warnings:

  - You are about to drop the column `input` on the `AgentTrace` table. All the data in the column will be lost.
  - You are about to drop the column `output` on the `AgentTrace` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AgentTrace" DROP COLUMN "input",
DROP COLUMN "output";
