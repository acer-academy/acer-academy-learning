/*
  Warnings:

  - Added the required column `timeTaken` to the `TakeAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TakeAnswer" ADD COLUMN     "timeTaken" INTEGER NOT NULL;
