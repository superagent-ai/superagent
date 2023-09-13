-- CreateEnum
CREATE TYPE "AgentType" AS ENUM ('REACT', 'PLANSOLVE');

-- CreateTable
CREATE TABLE "Agent" (
    "id" VARCHAR(255) NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AgentType" NOT NULL DEFAULT 'REACT',

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agent_userId_key" ON "Agent"("userId");

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
