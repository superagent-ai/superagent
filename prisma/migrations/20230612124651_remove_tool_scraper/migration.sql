/*
  Warnings:

  - The values [SCRAPER] on the enum `ToolType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ToolType_new" AS ENUM ('BROWSER', 'SEARCH', 'WOLFRAM_ALPHA');
ALTER TABLE "Tool" ALTER COLUMN "type" TYPE "ToolType_new" USING ("type"::text::"ToolType_new");
ALTER TYPE "ToolType" RENAME TO "ToolType_old";
ALTER TYPE "ToolType_new" RENAME TO "ToolType";
DROP TYPE "ToolType_old";
COMMIT;
