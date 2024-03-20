-- CreateEnum
CREATE TYPE "TimeClockType" AS ENUM ('IN', 'OUT');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "username" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeClock" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "accountId" TEXT NOT NULL,
    "type" "TimeClockType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeClock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TimeClock_accountId_timestamp_idx" ON "TimeClock"("accountId", "timestamp");

-- AddForeignKey
ALTER TABLE "TimeClock" ADD CONSTRAINT "TimeClock_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
