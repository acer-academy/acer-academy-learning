-- CreateEnum
CREATE TYPE "AccessRightEnum" AS ENUM ('STANDARD_ADMIN', 'SUPER_ADMIN');

-- CreateTable
CREATE TABLE "Admin" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "type" "AccessRightEnum" NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
