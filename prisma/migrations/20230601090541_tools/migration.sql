-- CreateEnum
CREATE TYPE "ToolType" AS ENUM ('BROWSER');

-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "toolId" VARCHAR(255);

-- CreateTable
CREATE TABLE "Tool" (
    "id" VARCHAR(255) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ToolType",
    "userId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
