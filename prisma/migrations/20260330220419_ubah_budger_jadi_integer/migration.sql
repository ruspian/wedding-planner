/*
  Warnings:

  - You are about to alter the column `totalBudget` on the `Wedding` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Wedding" ALTER COLUMN "totalBudget" SET DEFAULT 0,
ALTER COLUMN "totalBudget" SET DATA TYPE INTEGER;
