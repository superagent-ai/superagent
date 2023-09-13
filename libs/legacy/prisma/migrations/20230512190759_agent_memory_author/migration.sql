/*
  Warnings:

  - The `author` column on the `AgentMemory` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AgentMemoryAuthorType" AS ENUM ('HUMAN', 'AI');

-- AlterTable
ALTER TABLE "AgentMemory" DROP COLUMN "author",
ADD COLUMN     "author" "AgentMemoryAuthorType" NOT NULL DEFAULT 'HUMAN';
