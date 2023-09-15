-- CreateEnum
CREATE TYPE "DatasourceStatus" AS ENUM ('IN_PROGRESS', 'DONE');

-- AlterTable
ALTER TABLE "Datasource" ADD COLUMN     "status" "DatasourceStatus" NOT NULL DEFAULT 'IN_PROGRESS';
