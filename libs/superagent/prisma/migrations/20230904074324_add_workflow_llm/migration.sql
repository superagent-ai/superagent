-- CreateTable
CREATE TABLE "WorkflowLLM" (
    "worflowId" TEXT NOT NULL,
    "llmId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowLLM_pkey" PRIMARY KEY ("worflowId","llmId")
);

-- AddForeignKey
ALTER TABLE "WorkflowLLM" ADD CONSTRAINT "WorkflowLLM_worflowId_fkey" FOREIGN KEY ("worflowId") REFERENCES "Workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowLLM" ADD CONSTRAINT "WorkflowLLM_llmId_fkey" FOREIGN KEY ("llmId") REFERENCES "LLM"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
