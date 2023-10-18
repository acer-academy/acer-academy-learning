/*
  Warnings:

  - Added the required column `isCorrect` to the `TakeAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TakeAnswer" ADD COLUMN     "isCorrect" BOOLEAN NOT NULL;
