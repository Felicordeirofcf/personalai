"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { deleteOrder } from "@/lib/actions"; // Importe a ação do Passo 1
import { Search, Filter, Trash2, Loader2 } from "lucide-react"; // Instale lucide-react ou use texto

type Order = {
  id: string;
  createdAt: Date;
  fullName: string;
  email: string;
  status: string;
};

export function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null);

  // --- LÓGICA DE FILTRAGEM ---
  const filteredOrders = initialOrders.filter((order) => {
    const textMatch =
      order.fullName.toLowerCase().includes(filterText.toLowerCase()) ||
      order.email.toLowerCase().includes(filterText.toLowerCase());

    const statusMatch = filterStatus === "all" || order.status === filterStatus;

    return textMatch && statusMatch;
  });

  // --- LÓGICA DE DELETAR ---
  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja EXCLUIR este pedido?")) return;

    setLoadingDelete(id);
    const res = await deleteOrder(id);
    setLoadingDelete(null);

    if (!res.success) alert("Erro ao deletar.");
  }

  return (
    <div className="space-y-4">
      {/* BARRA DE FILTROS */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Busca por Nome */}
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar aluno..."
            className="h-10 w-full rounded-md border border-zinc-200 pl-9 pr-4 text-sm outline-none focus:border-zinc-400"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        {/* Filtro de Status */}
        <div className="relative">
          <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <select
            className="h-10 rounded-md border border-zinc-200 bg-white pl-9 pr-8 text-sm outline-none focus:border-zinc-400 cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos os Status</option>
            <option value="pending_payment">Aguardando Pagamento</option>
            <option value="paid_pending_review">Pago / Revisar</option>
            <option value="completed">Enviado</option>
            <option value="refused">Cancelado</option>
          </select>
        </div>
      </div>

      {/* TABELA */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-100 text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Aluno</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
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
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-900 shadow-sm hover:bg-zinc-100"
                      >
                        Ver Detalhes
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(order.id)}
                        disabled={loadingDelete === order.id}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-200 disabled:opacity-50"
                        title="Excluir"
                      >
                        {loadingDelete === order.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-zinc-400">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Badge dentro do componente ou importado
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending_payment: "bg-yellow-100 text-yellow-700",
    paid_pending_review: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    refused: "bg-red-100 text-red-700",
  };
  const labels: Record<string, string> = {
    pending_payment: "Aguardando Pagto",
    paid_pending_review: "Pago / Revisar",
    completed: "Enviado",
    refused: "Cancelado",
  };
  return (
    <Badge className={styles[status] || "bg-gray-100 text-gray-700"}>
      {labels[status] || status}
    </Badge>
  );
}