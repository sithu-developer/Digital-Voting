/*
  Warnings:

  - You are about to drop the column `StudentId` on the `Votes` table. All the data in the column will be lost.
  - Added the required column `studentId` to the `Votes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Votes" DROP CONSTRAINT "Votes_StudentId_fkey";

-- AlterTable
ALTER TABLE "Votes" DROP COLUMN "StudentId",
ADD COLUMN     "studentId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "Votes_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
