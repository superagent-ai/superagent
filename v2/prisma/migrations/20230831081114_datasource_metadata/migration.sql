-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DatasourceType" ADD VALUE 'GITHUB_REPOSITORY';
ALTER TYPE "DatasourceType" ADD VALUE 'MARKDOWN';
ALTER TYPE "DatasourceType" ADD VALUE 'WEBPAGE';
ALTER TYPE "DatasourceType" ADD VALUE 'AIRTABLE';

-- AlterTable
ALTER TABLE "Datasource" ADD COLUMN     "metadata" JSONB;
