-- DropForeignKey
ALTER TABLE "Agent" DROP CONSTRAINT "Agent_documentId_fkey";

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
