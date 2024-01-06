-- CreateEnum
CREATE TYPE "VectorDbProvider" AS ENUM ('PINECONE', 'ASTRA_DB', 'WEAVIATE', 'QDRANT');

-- AlterTable
ALTER TABLE "Datasource" ADD COLUMN     "vectorDbId" TEXT;

-- CreateTable
CREATE TABLE "VectorDb" (
    "id" TEXT NOT NULL,
    "provider" "VectorDbProvider" NOT NULL DEFAULT 'PINECONE',
    "options" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "apiUserId" TEXT NOT NULL,

    CONSTRAINT "VectorDb_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Datasource" ADD CONSTRAINT "Datasource_vectorDbId_fkey" FOREIGN KEY ("vectorDbId") REFERENCES "VectorDb"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VectorDb" ADD CONSTRAINT "VectorDb_apiUserId_fkey" FOREIGN KEY ("apiUserId") REFERENCES "ApiUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
