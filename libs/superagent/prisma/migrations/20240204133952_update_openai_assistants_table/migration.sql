/*
  Warnings:
  - You are about to drop the column `openaiMetadata` on the `Agent` table. All the data in the column will be lost.
*/
-- AlterTable
ALTER TABLE "Agent" DROP COLUMN "openaiMetadata",
ADD COLUMN     "metadata" JSONB;