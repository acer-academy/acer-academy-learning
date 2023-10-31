/*
  Warnings:

  - Added the required column `studentId` to the `AssignmentAttempt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssignmentAttempt" ADD COLUMN     "studentId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "AssignmentAttempt" ADD CONSTRAINT "AssignmentAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
