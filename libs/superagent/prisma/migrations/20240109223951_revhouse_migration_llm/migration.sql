/*
  Warnings:

  - You are about to drop the column `apiUserId` on the `LLM` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LLM" DROP CONSTRAINT "LLM_apiUserId_fkey";

-- AlterTable
ALTER TABLE "LLM" DROP COLUMN "apiUserId";
