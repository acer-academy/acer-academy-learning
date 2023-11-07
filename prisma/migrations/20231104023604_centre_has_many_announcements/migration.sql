/*
  Warnings:

  - You are about to drop the column `announcementId` on the `Centre` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Centre" DROP CONSTRAINT "Centre_announcementId_fkey";

-- AlterTable
ALTER TABLE "Centre" DROP COLUMN "announcementId";

-- CreateTable
CREATE TABLE "_AnnouncementToCentre" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AnnouncementToCentre_AB_unique" ON "_AnnouncementToCentre"("A", "B");

-- CreateIndex
CREATE INDEX "_AnnouncementToCentre_B_index" ON "_AnnouncementToCentre"("B");

-- AddForeignKey
ALTER TABLE "_AnnouncementToCentre" ADD CONSTRAINT "_AnnouncementToCentre_A_fkey" FOREIGN KEY ("A") REFERENCES "Announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnnouncementToCentre" ADD CONSTRAINT "_AnnouncementToCentre_B_fkey" FOREIGN KEY ("B") REFERENCES "Centre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
