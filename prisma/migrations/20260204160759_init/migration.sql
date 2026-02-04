-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('draft', 'pending_payment', 'paid_pending_review', 'ai_draft_ready', 'coach_adjusted', 'sent');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'draft',
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "timePerDayMin" INTEGER NOT NULL,
    "equipment" TEXT NOT NULL,
    "limitations" TEXT NOT NULL,
    "parqJson" JSONB NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "paymentNote" TEXT,
    "receiptPath" TEXT,
    "aiDraftJson" JSONB,
    "finalWorkoutJson" JSONB,
    "sentAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
