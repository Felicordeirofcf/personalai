import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Função simples para checar login
async function checkAuth() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("admin_session");
  const secret = process.env.JWT_SECRET || "segredo";
  
  if (!authCookie || authCookie.value !== secret) {
    return false;
  }
  return true;
}

export default async function AdminDashboard() {
  // 1. Verifica Segurança
  const isAuth = await checkAuth();
  if (!isAuth) {
    redirect("/admin/login");
  }

  // 2. Busca TODOS os pedidos (Lista)
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900">Painel do Personal</h1>
          <div className="text-sm text-zinc-500">
            Total: {orders.length} pedidos
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-100 text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium">Aluno</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {order.fullName}
                      <div className="text-xs font-normal text-zinc-400">
                        {order.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      {/* CORREÇÃO 1: Substituímos o componente Button por um Link estilizado direto */}
                      <Link 
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                      >
                        Ver Detalhes
                      </Link>
                    </td>
                  </tr>
                ))}

                {orders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-zinc-400">
                      Nenhum pedido encontrado ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente visual para as cores do status
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending_payment: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    paid_pending_review: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    completed: "bg-green-100 text-green-700 hover:bg-green-100",
    refused: "bg-red-100 text-red-700 hover:bg-red-100",
  };

  const labels: Record<string, string> = {
    pending_payment: "Aguardando Pagamento",
    paid_pending_review: "Pago / Revisar",
    completed: "Enviado",
    refused: "Cancelado",
  };

  return (
    /* CORREÇÃO 2: Removemos variant="secondary" */
    <Badge className={styles[status] || "bg-gray-100 text-gray-700"}>
      {labels[status] || status}
    </Badge>
  );
}