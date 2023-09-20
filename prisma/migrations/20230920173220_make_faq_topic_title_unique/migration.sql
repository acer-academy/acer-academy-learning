/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `FaqTopic` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FaqTopic_title_key" ON "FaqTopic"("title");
