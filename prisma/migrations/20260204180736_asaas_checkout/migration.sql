-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "asaasCheckoutId" TEXT,
ADD COLUMN     "asaasCheckoutUrl" TEXT,
ADD COLUMN     "asaasExternalRef" TEXT,
ADD COLUMN     "asaasPaymentId" TEXT,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentProvider" TEXT,
ADD COLUMN     "paymentRef" TEXT,
ADD COLUMN     "paymentUrl" TEXT;
