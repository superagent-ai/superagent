-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DatasourceType" ADD VALUE 'STRIPE';
ALTER TYPE "DatasourceType" ADD VALUE 'NOTION';
ALTER TYPE "DatasourceType" ADD VALUE 'SITEMAP';
ALTER TYPE "DatasourceType" ADD VALUE 'URL';

-- DropEnum
DROP TYPE "DocumentType";
