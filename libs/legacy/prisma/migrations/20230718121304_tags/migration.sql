-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "tags" JSONB DEFAULT '[]';

-- CreateTable
CREATE TABLE "Tag" (
    "id" VARCHAR(255) NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT DEFAULT '#0e8a16',
    "userId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
