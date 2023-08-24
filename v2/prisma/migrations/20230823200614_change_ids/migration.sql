/*
  Warnings:

  - The primary key for the `Agent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LLM` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Agent" DROP CONSTRAINT "Agent_llmId_fkey";

-- AlterTable
ALTER TABLE "Agent" DROP CONSTRAINT "Agent_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "llmId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Agent_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Agent_id_seq";

-- AlterTable
ALTER TABLE "LLM" DROP CONSTRAINT "LLM_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "LLM_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "LLM_id_seq";

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_llmId_fkey" FOREIGN KEY ("llmId") REFERENCES "LLM"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
