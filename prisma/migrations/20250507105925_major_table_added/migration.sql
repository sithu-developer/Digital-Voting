/*
  Warnings:

  - You are about to drop the column `password` on the `Admin` table. All the data in the column will be lost.
  - Added the required column `adminId` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `majorId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Admin_password_key";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "password",
ADD COLUMN     "adminId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "majorId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Major" (
    "id" SERIAL NOT NULL,
    "majorsOrAdmin" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Major_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Major_majorsOrAdmin_key" ON "Major"("majorsOrAdmin");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Major"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
