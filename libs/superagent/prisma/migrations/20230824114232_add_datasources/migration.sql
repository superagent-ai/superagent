-- CreateEnum
CREATE TYPE "DatasourceType" AS ENUM ('TXT', 'PDF', 'CSV', 'YOUTUBE', 'FUNCTION');

-- CreateTable
CREATE TABLE "Datasource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "type" "DatasourceType" NOT NULL,
    "apiUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Datasource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentDatasource" (
    "agentId" TEXT NOT NULL,
    "datasourceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentDatasource_pkey" PRIMARY KEY ("agentId","datasourceId")
);

-- AddForeignKey
ALTER TABLE "Datasource" ADD CONSTRAINT "Datasource_apiUserId_fkey" FOREIGN KEY ("apiUserId") REFERENCES "ApiUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentDatasource" ADD CONSTRAINT "AgentDatasource_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentDatasource" ADD CONSTRAINT "AgentDatasource_datasourceId_fkey" FOREIGN KEY ("datasourceId") REFERENCES "Datasource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
