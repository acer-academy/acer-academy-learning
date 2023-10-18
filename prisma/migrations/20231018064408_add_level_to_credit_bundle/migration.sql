/*
  Warnings:

  - Added the required column `level` to the `CreditBundle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CreditBundle" ADD COLUMN     "level" "LevelEnum" NOT NULL;
