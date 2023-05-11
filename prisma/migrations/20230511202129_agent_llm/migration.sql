-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "llm" JSONB NOT NULL DEFAULT '{ "provider": "openai", "model": "gpt-3.5-turbo" }';
