-- CreateTable
CREATE TABLE "AgentDocument" (
    "id" VARCHAR(255) NOT NULL,
    "documentId" VARCHAR(255),
    "agentId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AgentDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AgentDocument" ADD CONSTRAINT "AgentDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentDocument" ADD CONSTRAINT "AgentDocument_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
