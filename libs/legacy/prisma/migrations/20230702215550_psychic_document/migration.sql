-- AlterEnum
ALTER TYPE "DocumentType" ADD VALUE 'PSYCHIC';

-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "url" DROP NOT NULL;
