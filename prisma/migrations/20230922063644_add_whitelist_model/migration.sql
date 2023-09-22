/*
  Warnings:

  - A unique constraint covering the columns `[whitelistEmail]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[whitelistEmail]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[whitelistEmail]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `whitelistEmail` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whitelistEmail` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whitelistEmail` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TEACHER', 'STUDENT', 'ADMIN', 'SUPER_ADMIN');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "whitelistEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "whitelistEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "whitelistEmail" TEXT NOT NULL;

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
CREATE UNIQUE INDEX "Admin_whitelistEmail_key" ON "Admin"("whitelistEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Student_whitelistEmail_key" ON "Student"("whitelistEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_whitelistEmail_key" ON "Teacher"("whitelistEmail");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_whitelistEmail_fkey" FOREIGN KEY ("whitelistEmail") REFERENCES "WhitelistItem"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_whitelistEmail_fkey" FOREIGN KEY ("whitelistEmail") REFERENCES "WhitelistItem"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_whitelistEmail_fkey" FOREIGN KEY ("whitelistEmail") REFERENCES "WhitelistItem"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
