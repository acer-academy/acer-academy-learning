-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_creditBundleId_fkey";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "creditBundleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_creditBundleId_fkey" FOREIGN KEY ("creditBundleId") REFERENCES "CreditBundle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
