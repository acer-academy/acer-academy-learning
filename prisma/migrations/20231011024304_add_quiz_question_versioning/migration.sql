/*
  Warnings:

  - A unique constraint covering the columns `[nextVersionId]` on the table `QuizQuestion` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN     "nextVersionId" UUID,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "QuizQuestion_nextVersionId_key" ON "QuizQuestion"("nextVersionId");

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_nextVersionId_fkey" FOREIGN KEY ("nextVersionId") REFERENCES "QuizQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
