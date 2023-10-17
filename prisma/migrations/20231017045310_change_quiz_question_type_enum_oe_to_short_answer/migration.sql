/*
  Warnings:

  - The values [OPEN_ENDED] on the enum `QuizQuestionTypeEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuizQuestionTypeEnum_new" AS ENUM ('MCQ', 'MRQ', 'TFQ', 'SHORT_ANSWER');
ALTER TABLE "QuizQuestion" ALTER COLUMN "questionType" TYPE "QuizQuestionTypeEnum_new" USING ("questionType"::text::"QuizQuestionTypeEnum_new");
ALTER TYPE "QuizQuestionTypeEnum" RENAME TO "QuizQuestionTypeEnum_old";
ALTER TYPE "QuizQuestionTypeEnum_new" RENAME TO "QuizQuestionTypeEnum";
DROP TYPE "QuizQuestionTypeEnum_old";
COMMIT;
