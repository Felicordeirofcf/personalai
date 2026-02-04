import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import SendWhatsAppButton from "@/components/admin/SendWhatsAppButton";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: "Rascunho",
    pending_payment: "Aguardando pagamento",
    paid_pending_review: "Pago • Revisão pendente",
    ai_draft_ready: "IA pronta",
    coach_adjusted: "Ajustado",
    sent: "Enviado",
  };

  const label = map[status] ?? status;

  const cls =
    status === "pending_payment"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : status === "sent"
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-zinc-50 text-zinc-700 border-zinc-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}
    >
      {label}
    </span>
  );
}

export default async function AdminPage() {
  const ok = await requireAdmin();
  if (!ok) redirect("/admin/login");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Pedidos</h1>
          <p className="text-sm text-zinc-600">Últimos 50 pedidos criados no site.</p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/"
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
          >
            Ver landing
          </Link>
        </div>
      </header>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
          <div className="text-sm font-semibold">Nada por aqui ainda</div>
          <div className="mt-1 text-sm text-zinc-600">
            Faça um pedido na landing e ele vai aparecer aqui.
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="text-left px-4 py-3">Cliente</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Criado</th>
                <th className="text-right px-4 py-3">Ações</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-zinc-200">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{o.fullName}</div>
                    <div className="text-xs text-zinc-500">{o.email}</div>
                    <div className="text-xs text-zinc-500">{o.whatsapp}</div>
                    <div className="mt-1 font-mono text-[11px] text-zinc-400">{o.id}</div>
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>

                  <td className="px-4 py-3 text-zinc-600">
                    {new Date(o.createdAt).toLocaleString("pt-BR")}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/status/${o.id}`}
                        className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
                      >
                        Página do aluno
                      </Link>

                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="inline-flex items-center justify-center rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
                      >
                        Abrir
                      </Link>

                      <SendWhatsAppButton orderId={o.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
