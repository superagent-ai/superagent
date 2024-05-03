-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "LLMModel" ADD VALUE 'GPT_3_5_TURBO';
ALTER TYPE "LLMModel" ADD VALUE 'GPT_4';
ALTER TYPE "LLMModel" ADD VALUE 'GPT_4_32K';
ALTER TYPE "LLMModel" ADD VALUE 'GPT_4_0125_PREVIEW';
ALTER TYPE "LLMModel" ADD VALUE 'GPT_4_TURBO';
ALTER TYPE "LLMModel" ADD VALUE 'GPT_4_TURBO_2024_04_09';
