/*
  Warnings:

  - You are about to drop the column `model` on the `LLM` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "llmModel" "LLMModel" NOT NULL DEFAULT 'GPT_3_5_TURBO_16K_0613';

-- AlterTable
ALTER TABLE "LLM" DROP COLUMN "model";
