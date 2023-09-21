/*
  Warnings:

  - A unique constraint covering the columns `[promoCode]` on the table `Promotion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Promotion_promoCode_key" ON "Promotion"("promoCode");
