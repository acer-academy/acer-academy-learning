-- CreateEnum
CREATE TYPE "PromotionStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PURCHASED', 'DEDUCTED', 'REFUNDED');

-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "status" "PromotionStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "Term" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Term_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" UUID NOT NULL,
    "amount" DOUBLE PRECISION,
    "currency" TEXT,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "creditsTransacted" INTEGER NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "reason" TEXT,
    "termId" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    "promotionId" UUID,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
