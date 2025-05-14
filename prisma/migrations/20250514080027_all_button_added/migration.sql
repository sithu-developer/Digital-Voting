/*
  Warnings:

  - You are about to drop the column `showResultOrTimeUp` on the `Major` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Categories" ADD COLUMN     "isShownResult" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Major" DROP COLUMN "showResultOrTimeUp",
ADD COLUMN     "isTimeUp" BOOLEAN NOT NULL DEFAULT false;
