import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { isAdminSession } from "@/lib/adminSession";
import { saveProduct } from "../actions";

export const dynamic = "force-dynamic";

const field = "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10";
const label = "text-sm font-semibold text-zinc-800";

function centsToInput(c: number | null | undefined) {
  return c ? (c / 100).toFixed(2).replace(".", ",") : "";
}

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  if (!(await isAdminSession())) redirect("/admin/login");

  const { id } = await props.params;
  const isNew = id === "nova";
  const product = isNew ? null : await prisma.product.findUnique({ where: { id } });
  if (!isNew && !product) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">{isNew ? "Nova planilha" : "Editar planilha"}</h1>
        <div className="flex gap-3 text-sm">
          {product?.active ? (
            <Link href={`/planilhas/${product.slug}`} target="_blank" className="font-semibold text-emerald-700 hover:underline">
              Ver no site ↗
            </Link>
          ) : null}
          <Link href="/admin/planilhas" className="text-zinc-500 hover:underline">
            Voltar
          </Link>
        </div>
      </div>

      <form action={saveProduct} className="space-y-5">
        <input type="hidden" name="id" value={product?.id ?? ""} />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className={label}>Título *</label>
            <input name="title" required defaultValue={product?.title} className={field} />
          </div>
          <div className="space-y-1">
            <label className={label}>Slug (endereço)</label>
            <input name="slug" defaultValue={product?.slug} placeholder="gerado a partir do título" className={field} />
          </div>
        </div>

        <div className="space-y-1">
          <label className={label}>Subtítulo (promessa curta)</label>
          <input name="subtitle" defaultValue={product?.subtitle} className={field} />
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          <div className="space-y-1">
            <label className={label}>Preço (R$) *</label>
            <input name="price" required defaultValue={centsToInput(product?.priceCents)} placeholder="27,00" className={field} />
          </div>
          <div className="space-y-1">
            <label className={label}>Preço &quot;de&quot; (R$)</label>
            <input name="compareAt" defaultValue={centsToInput(product?.compareAtCents)} placeholder="opcional" className={field} />
          </div>
          <div className="space-y-1">
            <label className={label}>Nível</label>
            <input name="level" defaultValue={product?.level} placeholder="Iniciante" className={field} />
          </div>
          <div className="space-y-1">
            <label className={label}>Local</label>
            <input name="location" defaultValue={product?.location} placeholder="Academia" className={field} />
          </div>
          <div className="space-y-1">
            <label className={label}>Semanas</label>
            <input name="durationWeeks" type="number" min={1} defaultValue={product?.durationWeeks ?? ""} className={field} />
          </div>
        </div>

        <div className="space-y-1">
          <label className={label}>Benefícios (um por linha)</label>
          <textarea name="highlights" rows={4} defaultValue={product?.highlights.join("\n")} className={field} />
        </div>

        <div className="space-y-1">
          <label className={label}>Descrição de venda</label>
          <textarea name="description" rows={5} defaultValue={product?.description} className={field} />
        </div>

        <div className="space-y-1">
          <label className={label}>Conteúdo do treino (vai para o PDF do comprador)</label>
          <textarea name="content" rows={18} defaultValue={product?.content} className={`${field} font-mono`} />
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" name="active" defaultChecked={product?.active ?? false} className="h-4 w-4" />
            À venda no site
          </label>
          <label className="flex items-center gap-2 text-sm">
            Ordem
            <input name="sortOrder" type="number" defaultValue={product?.sortOrder ?? 0} className={`${field} w-20`} />
          </label>
        </div>

        <button type="submit" className="rounded-xl bg-zinc-900 px-6 py-3 font-semibold text-white hover:bg-zinc-800">
          Salvar
        </button>
      </form>
    </div>
  );
}
