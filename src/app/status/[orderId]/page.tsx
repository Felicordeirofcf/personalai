import { prisma } from "@/lib/db";

type Props = { params: Promise<{ orderId: string }> };

export default async function StatusPage({ params }: Props) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return <div className="p-8">Pedido não encontrado.</div>;

  return (
    <div className="mx-auto max-w-2xl p-8 space-y-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-tight">Status do Pedido</h1>

        <div className="mt-4 space-y-2 text-sm text-zinc-700">
          <div><b>Código:</b> <span className="font-mono">{order.id}</span></div>
          <div><b>Status:</b> {order.status}</div>

          {order.status === "pending_payment" && order.asaasCheckoutUrl && (
            <a
              href={order.asaasCheckoutUrl}
              className="inline-flex mt-3 rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Pagar agora (Pix/Cartão)
            </a>
          )}

          <p className="text-zinc-600 mt-3">
            Assim que o pagamento for confirmado, seu treino entra em revisão e você recebe pelo WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
