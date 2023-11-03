/*
  Warnings:

  - Added the required column `fileName` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "fileName" TEXT NOT NULL;
