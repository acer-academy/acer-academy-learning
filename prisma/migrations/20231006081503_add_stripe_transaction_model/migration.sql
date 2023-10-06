-- CreateEnum
CREATE TYPE "StripeTransactionStatus" AS ENUM ('PROCESSING', 'SUCCEEDED', 'FAILED', 'VOID', 'REFUNDED');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "stripeTransactionId" UUID;

-- CreateTable
CREATE TABLE "StripeTransaction" (
    "id" UUID NOT NULL,
    "paymentIntentId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "status" "StripeTransactionStatus" NOT NULL DEFAULT 'PROCESSING',
    "receiptUrl" TEXT,
    "chargeId" TEXT,

    CONSTRAINT "StripeTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StripeTransaction_paymentIntentId_key" ON "StripeTransaction"("paymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeTransaction_chargeId_key" ON "StripeTransaction"("chargeId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_stripeTransactionId_fkey" FOREIGN KEY ("stripeTransactionId") REFERENCES "StripeTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
