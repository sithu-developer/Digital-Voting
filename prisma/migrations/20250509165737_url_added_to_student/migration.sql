/*
  Warnings:

  - Added the required column `url` to the `Students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Students" ADD COLUMN     "url" TEXT NOT NULL;
