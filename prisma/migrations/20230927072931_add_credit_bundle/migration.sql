/*
  Warnings:

  - Added the required column `creditBundleId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "creditBundleId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "CreditBundle" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "numCredits" INTEGER NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CreditBundle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CreditBundle_name_key" ON "CreditBundle"("name");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_creditBundleId_fkey" FOREIGN KEY ("creditBundleId") REFERENCES "CreditBundle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
