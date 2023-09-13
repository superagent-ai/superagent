/*
  Warnings:

  - Added the required column `apiUserId` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN     "apiUserId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_apiUserId_fkey" FOREIGN KEY ("apiUserId") REFERENCES "ApiUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
