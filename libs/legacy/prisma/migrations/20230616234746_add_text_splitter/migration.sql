-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "splitter" JSONB NOT NULL DEFAULT '{ "type": "character", "chunk_size": 1000, "chunk_overlap": 0}';
