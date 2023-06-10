-- CreateTable
CREATE TABLE "AgentTrace" (
    "id" VARCHAR(255) NOT NULL,
    "agentId" VARCHAR(255) NOT NULL,
    "input" JSONB,
    "output" JSONB,
    "intermediateSteps" JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentTrace_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AgentTrace" ADD CONSTRAINT "AgentTrace_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
