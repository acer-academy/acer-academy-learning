-- CreateEnum
CREATE TYPE "SubjectEnum" AS ENUM ('MATHEMATICS', 'ENGLISH', 'SCIENCE');

-- CreateEnum
CREATE TYPE "LevelEnum" AS ENUM ('P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'S1', 'S2', 'S3', 'S4', 'S5', 'J1', 'J2');

-- CreateTable
CREATE TABLE "Teacher" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "levels" "LevelEnum"[],
    "subjects" "SubjectEnum"[],
    "centreId" UUID NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Centre" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Centre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Centre_name_key" ON "Centre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Centre_address_key" ON "Centre"("address");

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_centreId_fkey" FOREIGN KEY ("centreId") REFERENCES "Centre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
