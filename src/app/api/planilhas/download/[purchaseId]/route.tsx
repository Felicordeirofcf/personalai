import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { prisma } from "@/lib/db";
import { refreshPurchaseStatus } from "@/lib/purchases";
import { ProductPdf } from "@/components/pdf/ProductPdf";

export const dynamic = "force-dynamic";

export async function GET(req: Request, props: { params: Promise<{ purchaseId: string }> }) {
  const { purchaseId } = await props.params;
  const token = new URL(req.url).searchParams.get("t") ?? "";

  const found = await prisma.productPurchase.findUnique({ where: { id: purchaseId } });
  if (!found || found.accessToken !== token) {
    return NextResponse.json({ error: "Link inválido" }, { status: 404 });
  }

  const purchase = await refreshPurchaseStatus(purchaseId);
  if (!purchase || purchase.status !== "paid") {
    return NextResponse.json({ error: "Pagamento ainda não confirmado" }, { status: 402 });
  }

  const product = await prisma.product.findUnique({ where: { id: purchase.productId } });
  if (!product) return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });

  await prisma.productPurchase.update({
    where: { id: purchase.id },
    data: { downloadCount: { increment: 1 } },
  });

  const stream = await renderToStream(
    <ProductPdf
      title={product.title}
      subtitle={product.subtitle}
      content={product.content}
      buyerName={purchase.fullName}
      buyerEmail={purchase.email}
    />,
  );

  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${product.slug}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
