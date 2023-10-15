/*
  Warnings:

  - You are about to drop the column `days` on the `Class` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Class" DROP COLUMN "days";

-- DropEnum
DROP TYPE "DaysEnum";
