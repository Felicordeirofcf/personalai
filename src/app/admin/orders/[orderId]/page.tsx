import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import ParqResumo from "@/components/admin/ParqResumo";
import WorkoutReviewPanel from "@/components/admin/WorkoutReviewPanel";

type Props = {
  params: Promise<Record<string, string | string[] | undefined>>;
};

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
        : status === "coach_adjusted"
          ? "bg-sky-50 text-sky-700 border-sky-200"
          : status === "ai_draft_ready"
            ? "bg-violet-50 text-violet-700 border-violet-200"
            : "bg-zinc-50 text-zinc-700 border-zinc-200";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

export default async function AdminOrderPage({ params }: Props) {
  const ok = await requireAdmin();
  if (!ok) redirect("/admin/login");

  const p = await params;
  const raw = p.orderId ?? p.id;
  const orderId = Array.isArray(raw) ? raw[0] : raw;

  if (!orderId) {
    return (
      <div className="space-y-2 p-6">
        <h1 className="text-xl font-bold">Pedido inválido</h1>
        <p className="text-sm text-zinc-600">Parâmetro ausente.</p>
        <pre className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-xs overflow-auto">
          {JSON.stringify(p, null, 2)}
        </pre>
      </div>
    );
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return <div className="p-6">Pedido não encontrado.</div>;

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Pedido
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight">
                {order.fullName}
              </h1>
              <StatusBadge status={order.status} />
            </div>
            <div className="mt-2 font-mono text-xs text-zinc-500">{order.id}</div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={`/status/${order.id}`}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
            >
              Ver página do aluno
            </a>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
          <b>Fluxo:</b> gerar treino com IA → revisar/editar → copiar e enviar manualmente no WhatsApp.
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Cliente
          </div>
          <div className="mt-3 space-y-1">
            <div className="text-lg font-bold">{order.fullName}</div>
            <div className="text-sm text-zinc-600">{order.email}</div>
            <div className="text-sm text-zinc-600">WhatsApp: {order.whatsapp}</div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Pagamento
          </div>
          <div className="mt-3 space-y-2 text-sm text-zinc-700">
            <div>
              <b>Valor:</b> R$ {(order.priceCents / 100).toFixed(2)}
            </div>
            <div>
              <b>Observação:</b> {order.paymentNote ?? "—"}
            </div>
            <div>
              <b>Comprovante:</b> {order.receiptPath ?? "—"}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Dados do pedido
          </div>
          <div className="mt-3 space-y-2 text-sm text-zinc-700">
            <div><b>Objetivo:</b> {order.goal}</div>
            <div><b>Local:</b> {order.location}</div>
            <div><b>Frequência:</b> {order.frequency}</div>
            <div><b>Experiência:</b> {order.experience}</div>
            <div><b>Tempo/dia:</b> {order.timePerDayMin} min</div>
            <div><b>Equipamentos:</b> {order.equipment}</div>
            <div><b>Limitações:</b> {order.limitations}</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <ParqResumo data={order.parqJson as any} />
      </div>

      <WorkoutReviewPanel
        orderId={order.id}
        aiDraftJson={order.aiDraftJson}
        finalWorkoutJson={order.finalWorkoutJson}
        status={order.status}
      />
    </div>
  );
}
