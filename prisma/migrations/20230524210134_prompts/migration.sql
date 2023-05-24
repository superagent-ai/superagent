/*
  Warnings:

  - The values [OPENAPI] on the enum `DocumentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DocumentType_new" AS ENUM ('TXT', 'PDF', 'YOUTUBE');
ALTER TABLE "Document" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Document" ALTER COLUMN "type" TYPE "DocumentType_new" USING ("type"::text::"DocumentType_new");
ALTER TYPE "DocumentType" RENAME TO "DocumentType_old";
ALTER TYPE "DocumentType_new" RENAME TO "DocumentType";
DROP TYPE "DocumentType_old";
ALTER TABLE "Document" ALTER COLUMN "type" SET DEFAULT 'TXT';
COMMIT;

-- CreateTable
CREATE TABLE "Prompts" (
    "id" VARCHAR(255) NOT NULL,
    "template" TEXT NOT NULL,
    "input_variables" JSONB NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Prompts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Prompts" ADD CONSTRAINT "Prompts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
