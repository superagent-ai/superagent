/*
  Warnings:

  - Added the required column `name` to the `Prompts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prompts" ADD COLUMN     "name" TEXT NOT NULL;
