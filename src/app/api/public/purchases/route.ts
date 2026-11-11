import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createPayment } from "@/lib/asaas";
import { purchaseAccessUrl } from "@/lib/purchases";

const PurchaseSchema = z.object({
  productSlug: z.string().min(1),
  fullName: z.string().min(3),
  email: z.string().email(),
  whatsapp: z.string().min(8),
  cpf: z.string().min(11),
});

export async function POST(req: Request) {
  try {
    const data = PurchaseSchema.parse(await req.json());

    const product = await prisma.product.findUnique({ where: { slug: data.productSlug } });
    if (!product || !product.active) {
      return NextResponse.json({ ok: false, error: "Planilha indisponível" }, { status: 404 });
    }

    const accessToken = randomBytes(24).toString("hex");

    const purchase = await prisma.productPurchase.create({
      data: {
        productId: product.id,
        fullName: data.fullName,
        email: data.email,
        whatsapp: data.whatsapp,
        priceCents: product.priceCents,
        accessToken,
      },
    });

    const accessUrl = purchaseAccessUrl(purchase);

    const payment = await createPayment({
      externalReference: purchase.id,
      description: `Planilha: ${product.title}`,
      fullName: data.fullName,
      email: data.email,
      whatsapp: data.whatsapp,
      cpfCnpj: data.cpf.replace(/\D/g, ""),
      valueBRL: product.priceCents / 100,
      successUrl: accessUrl,
    });

    await prisma.productPurchase.update({
      where: { id: purchase.id },
      data: { asaasPaymentId: payment.id, paymentUrl: payment.invoiceUrl },
    });

    return NextResponse.json({ ok: true, checkoutUrl: payment.invoiceUrl, accessUrl });
  } catch (err: unknown) {
    console.error("Erro ao criar compra de planilha:", err);
    const message =
      err instanceof z.ZodError ? "Confira os dados preenchidos" : err instanceof Error ? err.message : "Erro ao criar compra";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
