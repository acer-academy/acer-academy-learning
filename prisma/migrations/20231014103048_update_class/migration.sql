/*
  Warnings:

  - You are about to drop the column `startRecurringDate` on the `Class` table. All the data in the column will be lost.
  - Made the column `endRecurringDate` on table `Class` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Class" DROP COLUMN "startRecurringDate",
ALTER COLUMN "endRecurringDate" SET NOT NULL;
