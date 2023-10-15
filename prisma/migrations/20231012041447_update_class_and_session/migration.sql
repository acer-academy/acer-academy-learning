/*
  Warnings:

  - You are about to drop the column `end` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `capacity` on the `Session` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_classId_fkey";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "end",
DROP COLUMN "start",
ADD COLUMN     "endRecurringDate" TIMESTAMP(3),
ADD COLUMN     "startRecurringDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "capacity",
ALTER COLUMN "classId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;
