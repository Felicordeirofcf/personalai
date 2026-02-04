import { prisma } from "@/lib/db";

type Props = {
  params: Promise<{ orderId: string }>;
};

export default async function StatusPage({ params }: Props) {
  const { orderId } = await params;

  if (!orderId) return <div className="p-8">Pedido inválido (orderId ausente).</div>;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) return <div className="p-8">Pedido não encontrado.</div>;

  return (
    <div className="mx-auto max-w-2xl p-8 space-y-6">
      <h1 className="text-2xl font-bold">Status do Pedido</h1>

      <div className="rounded-xl border p-4 space-y-2">
        <div><b>Código:</b> {order.id}</div>
        <div><b>Status:</b> {order.status}</div>
        <div className="text-zinc-600 text-sm">
          Assim que o pagamento for confirmado manualmente, o status muda e você recebe o treino.
        </div>
      </div>
    </div>
  );
}
