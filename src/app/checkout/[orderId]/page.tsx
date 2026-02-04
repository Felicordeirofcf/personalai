import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

type Props = {
  params: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminOrderPage({ params }: Props) {
  const ok = await requireAdmin();
  if (!ok) redirect("/admin/login");

  const p = await params;

  const raw = p.orderId ?? p.id; // funciona para [orderId] ou [id]
  const orderId = Array.isArray(raw) ? raw[0] : raw;

  if (!orderId) {
    return (
      <div className="p-8">
        Pedido inválido (param ausente). <br />
        Params recebidos: <pre>{JSON.stringify(p, null, 2)}</pre>
      </div>
    );
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) return <div className="p-8">Pedido não encontrado.</div>;

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Pedido {order.id}</h1>

      <div className="rounded-xl border p-4 space-y-1">
        <div><b>Status:</b> {order.status}</div>
        <div><b>Nome:</b> {order.fullName}</div>
        <div><b>Email:</b> {order.email}</div>
        <div><b>WhatsApp:</b> {order.whatsapp}</div>
      </div>

      <h2 className="font-bold">PAR-Q / Dados</h2>
      <pre className="rounded-xl border p-4 overflow-auto text-sm">
        {JSON.stringify(order.parqJson, null, 2)}
      </pre>
    </div>
  );
}
