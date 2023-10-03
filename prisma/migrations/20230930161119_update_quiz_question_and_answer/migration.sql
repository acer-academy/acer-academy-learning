/*
  Warnings:

  - You are about to drop the column `options` on the `QuizQuestion` table. All the data in the column will be lost.
  - Added the required column `isCorrect` to the `QuizAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuizAnswer" ADD COLUMN     "isCorrect" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "QuizQuestion" DROP COLUMN "options";
