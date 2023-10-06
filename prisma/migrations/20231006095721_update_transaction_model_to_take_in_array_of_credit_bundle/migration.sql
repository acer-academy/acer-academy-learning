/*
  Warnings:

  - You are about to drop the column `creditBundleId` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_creditBundleId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "creditBundleId",
ADD COLUMN     "creditBundleIdArray" TEXT[];
