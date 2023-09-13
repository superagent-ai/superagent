-- DropIndex
DROP INDEX "ApiUser_token_key";

-- AlterTable
ALTER TABLE "ApiUser" ALTER COLUMN "token" DROP NOT NULL;
