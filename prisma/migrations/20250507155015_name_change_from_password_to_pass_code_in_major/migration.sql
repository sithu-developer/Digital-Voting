/*
  Warnings:

  - You are about to drop the column `password` on the `Major` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[passCode]` on the table `Major` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `passCode` to the `Major` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Major" DROP COLUMN "password",
ADD COLUMN     "passCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Major_passCode_key" ON "Major"("passCode");
