/*
  Warnings:

  - Added the required column `apiKey` to the `LLM` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LLMProvider" AS ENUM ('OPENAI');

-- CreateEnum
CREATE TYPE "LLMModel" AS ENUM ('GPT_3_5_TURBO_16K_0613', 'GPT_3_5_TURBO_0613', 'GPT_4_0613', 'GPT_4_32K_0613');

-- AlterTable
ALTER TABLE "LLM" ADD COLUMN     "apiKey" TEXT NOT NULL,
ADD COLUMN     "model" "LLMModel" NOT NULL DEFAULT 'GPT_3_5_TURBO_16K_0613',
ADD COLUMN     "options" JSONB,
ADD COLUMN     "provider" "LLMProvider" NOT NULL DEFAULT 'OPENAI';
