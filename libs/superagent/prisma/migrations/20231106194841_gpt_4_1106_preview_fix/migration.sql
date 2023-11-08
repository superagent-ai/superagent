/*
  Warnings:

  - The values [GPT_4_1106_preview] on the enum `LLMModel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LLMModel_new" AS ENUM ('GPT_3_5_TURBO_16K_0613', 'GPT_3_5_TURBO_0613', 'GPT_4_0613', 'GPT_4_32K_0613', 'GPT_4_1106_PREVIEW');
ALTER TABLE "Agent" ALTER COLUMN "llmModel" DROP DEFAULT;
ALTER TABLE "Agent" ALTER COLUMN "llmModel" TYPE "LLMModel_new" USING ("llmModel"::text::"LLMModel_new");
ALTER TYPE "LLMModel" RENAME TO "LLMModel_old";
ALTER TYPE "LLMModel_new" RENAME TO "LLMModel";
DROP TYPE "LLMModel_old";
ALTER TABLE "Agent" ALTER COLUMN "llmModel" SET DEFAULT 'GPT_3_5_TURBO_16K_0613';
COMMIT;
