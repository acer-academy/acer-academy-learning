/*
  Warnings:

  - A unique constraint covering the columns `[nextVersionId]` on the table `Quiz` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "nextVersionId" UUID,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_nextVersionId_key" ON "Quiz"("nextVersionId");

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_nextVersionId_fkey" FOREIGN KEY ("nextVersionId") REFERENCES "Quiz"("id") ON DELETE SET NULL ON UPDATE CASCADE;
