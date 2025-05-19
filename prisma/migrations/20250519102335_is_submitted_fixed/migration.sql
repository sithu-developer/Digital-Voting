/*
  Warnings:

  - You are about to drop the column `isSubmited` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isSubmited",
ADD COLUMN     "isSubmitted" BOOLEAN NOT NULL DEFAULT false;
