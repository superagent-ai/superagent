/*
  Warnings:

  - Added the required column `apiUserId` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apiUserId` to the `LLM` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "apiUserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LLM" ADD COLUMN     "apiUserId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_apiUserId_fkey" FOREIGN KEY ("apiUserId") REFERENCES "ApiUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LLM" ADD CONSTRAINT "LLM_apiUserId_fkey" FOREIGN KEY ("apiUserId") REFERENCES "ApiUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
