/*
  Warnings:

  - A unique constraint covering the columns `[whitelistItemId]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[whitelistItemId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[whitelistItemId]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `whitelistItemId` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whitelistItemId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whitelistItemId` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TEACHER', 'STUDENT', 'ADMIN', 'SUPER_ADMIN');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "whitelistItemId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "whitelistItemId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "whitelistItemId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "WhitelistItem" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "WhitelistItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WhitelistItem_email_key" ON "WhitelistItem"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_whitelistItemId_key" ON "Admin"("whitelistItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_whitelistItemId_key" ON "Student"("whitelistItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_whitelistItemId_key" ON "Teacher"("whitelistItemId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_whitelistItemId_fkey" FOREIGN KEY ("whitelistItemId") REFERENCES "WhitelistItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_whitelistItemId_fkey" FOREIGN KEY ("whitelistItemId") REFERENCES "WhitelistItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_whitelistItemId_fkey" FOREIGN KEY ("whitelistItemId") REFERENCES "WhitelistItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
