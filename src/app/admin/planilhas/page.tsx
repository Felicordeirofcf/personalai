import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { isAdminSession } from "@/lib/adminSession";
import { formatBRL } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPlanilhasPage() {
  if (!(await isAdminSession())) redirect("/admin/login");

  const [products, purchases] = await Promise.all([
    prisma.product.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: { _count: { select: { purchases: { where: { status: "paid" } } } } },
    }),
    prisma.productPurchase.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { product: true } }),
  ]);

  const paid = purchases.filter((p) => p.status === "paid");
  const revenue = paid.reduce((sum, p) => sum + p.priceCents, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Planilhas prontas</h1>
          <p className="text-sm text-zinc-500">
            Entrega automática: pagou → download liberado + link no WhatsApp do aluno.
          </p>
        </div>
        <Link href="/admin/planilhas/nova" className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
          + Nova planilha
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Vendas pagas (últimas 50)" value={String(paid.length)} />
        <Stat label="Faturamento (últimas 50)" value={formatBRL(revenue)} />
        <Stat label="Planilhas ativas" value={String(products.filter((p) => p.active).length)} />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-200">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500">
            <tr>
              <th className="p-3">Planilha</th>
              <th className="p-3">Preço</th>
              <th className="p-3">Vendas</th>
              <th className="p-3">Status</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-zinc-100">
                <td className="p-3">
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-xs text-zinc-500">/planilhas/{p.slug}</div>
                </td>
                <td className="p-3">{formatBRL(p.priceCents)}</td>
                <td className="p-3">{p._count.purchases}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      p.active ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {p.active ? "À venda" : "Rascunho"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Link href={`/admin/planilhas/${p.id}`} className="font-semibold text-emerald-700 hover:underline">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-zinc-500">
                  Nenhuma planilha ainda. Crie a primeira ou rode <code>node scripts/seed-planilhas.mjs</code>.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-extrabold">Últimas compras</h2>
        <div className="overflow-x-auto rounded-2xl border border-zinc-200">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500">
              <tr>
                <th className="p-3">Data</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Planilha</th>
                <th className="p-3">Valor</th>
                <th className="p-3">Status</th>
                <th className="p-3">Downloads</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p.id} className="border-t border-zinc-100">
                  <td className="p-3 whitespace-nowrap">{p.createdAt.toLocaleString("pt-BR")}</td>
                  <td className="p-3">
                    <div className="font-semibold">{p.fullName}</div>
                    <div className="text-xs text-zinc-500">
                      {p.email} • {p.whatsapp}
                    </div>
                  </td>
                  <td className="p-3">{p.product.title}</td>
                  <td className="p-3">{formatBRL(p.priceCents)}</td>
                  <td className="p-3">{p.status === "paid" ? "✅ Pago" : p.status === "canceled" ? "Cancelado" : "⏳ Pendente"}</td>
                  <td className="p-3">{p.downloadCount}</td>
                </tr>
              ))}
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-zinc-500">
                    Nenhuma compra ainda.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 p-4">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="text-2xl font-extrabold">{value}</div>
    </div>
  );
}
