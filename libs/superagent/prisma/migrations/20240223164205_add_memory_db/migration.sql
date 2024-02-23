-- CreateEnum
CREATE TYPE "MemoryDbProvider" AS ENUM ('MOTORHEAD', 'REDIS');

-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "memory" "MemoryDbProvider" DEFAULT 'MOTORHEAD';

-- CreateTable
CREATE TABLE "MemoryDb" (
    "id" TEXT NOT NULL,
    "provider" "MemoryDbProvider" NOT NULL DEFAULT 'MOTORHEAD',
    "options" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "apiUserId" TEXT NOT NULL,

    CONSTRAINT "MemoryDb_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MemoryDb" ADD CONSTRAINT "MemoryDb_apiUserId_fkey" FOREIGN KEY ("apiUserId") REFERENCES "ApiUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
