import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const labels: Record<string, string> = {
  draft: "Aguardando dados",
  pending_payment: "Aguardando pagamento",
  paid_pending_review: "Pago • aguardando revisão",
  ai_draft_ready: "Rascunho pronto • aguardando ajuste",
  coach_adjusted: "Ajustado • pronto para envio",
  sent: "Enviado ✅",
};

export default async function StatusPage(props: { params: Promise<{ orderId: string }> }) {
    const params = await props.params;
const order = await prisma.order.findUnique({ where: { id: params.orderId } });
  if (!order) return <div className="p-8">Pedido não encontrado.</div>;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xl font-extrabold">Status do pedido</div>
            <Badge>{labels[order.status]}</Badge>
          </div>
          <div className="text-sm text-zinc-600">
            Pedido: <strong>{order.id.slice(-8).toUpperCase()}</strong>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-zinc-700">
          <div>Aluno(a): <strong>{order.fullName}</strong></div>
          <div>Email: <strong>{order.email}</strong></div>
          <div>WhatsApp: <strong>{order.whatsapp}</strong></div>

          {order.status === "sent" && (
            <a
              className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-4 text-white font-semibold"
              href={`/api/orders/${order.id}/pdf`}
              target="_blank"
              rel="noreferrer"
            >
              Baixar treino em PDF
            </a>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
