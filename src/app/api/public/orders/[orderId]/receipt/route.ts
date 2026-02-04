import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import path from "path";
import fs from "fs/promises";

export async function POST(req: Request, props: { params: Promise<{ orderId: string }> }) {
    const params = await props.params;
const form = await req.formData();
  const file = form.get("receipt") as File | null;
  const paymentNote = (form.get("paymentNote") as string | null) ?? null;

  if (!file) return NextResponse.json({ error: "Arquivo obrigatório" }, { status: 400 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const safeExt = ["png", "jpg", "jpeg", "pdf", "webp"].includes(ext) ? ext : "bin";

  const uploadsDir = path.join(process.cwd(), "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const filename = `${params.orderId}-${Date.now()}.${safeExt}`;
  const filepath = path.join(uploadsDir, filename);
  await fs.writeFile(filepath, bytes);

  await prisma.order.update({
    where: { id: params.orderId },
    data: {
      receiptPath: filename,
      paymentNote,
      status: "paid_pending_review",
    },
  });

  return NextResponse.redirect(new URL(`/status/${params.orderId}`, req.url));
}
