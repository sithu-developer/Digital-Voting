/*
  Warnings:

  - You are about to drop the column `quantity` on the `Major` table. All the data in the column will be lost.
  - Added the required column `maxQuantity` to the `Major` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Major" DROP COLUMN "quantity",
ADD COLUMN     "maxQuantity" INTEGER NOT NULL;
