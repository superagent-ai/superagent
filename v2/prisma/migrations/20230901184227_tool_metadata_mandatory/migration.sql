/*
  Warnings:

  - Made the column `metadata` on table `Tool` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Tool" ALTER COLUMN "metadata" SET NOT NULL;
