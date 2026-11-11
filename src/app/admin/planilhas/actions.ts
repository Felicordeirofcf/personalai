"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { isAdminSession } from "@/lib/adminSession";

function slugify(v: string) {
  return v
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toCents(v: FormDataEntryValue | null) {
  const n = Number(String(v ?? "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : null;
}

export async function saveProduct(formData: FormData) {
  if (!(await isAdminSession())) redirect("/admin/login");

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const priceCents = toCents(formData.get("price"));
  if (!title || !priceCents) throw new Error("Título e preço são obrigatórios.");

  const weeks = Number(formData.get("durationWeeks"));
  const data = {
    title,
    slug: slugify(String(formData.get("slug") || title)),
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    highlights: String(formData.get("highlights") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    level: String(formData.get("level") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    durationWeeks: Number.isFinite(weeks) && weeks > 0 ? Math.round(weeks) : null,
    priceCents,
    compareAtCents: toCents(formData.get("compareAt")),
    content: String(formData.get("content") ?? ""),
    active: formData.get("active") === "on",
    sortOrder: Number(formData.get("sortOrder")) || 0,
  };

  if (id) await prisma.product.update({ where: { id }, data });
  else await prisma.product.create({ data });

  revalidatePath("/");
  revalidatePath("/planilhas");
  redirect("/admin/planilhas");
}
