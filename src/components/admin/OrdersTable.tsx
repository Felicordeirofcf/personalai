"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Order = {
  id: string;
  createdAt: string;
  status: string;
  fullName: string;
  goal: string;
};

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    if (res.ok) setOrders(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin";
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="text-xl font-extrabold">Pedidos</div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load}>Atualizar</Button>
          <Button variant="outline" onClick={logout}>Sair</Button>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-zinc-600">Carregando...</div>
      ) : (
        <div className="grid gap-3">
          {orders.map((o) => (
            <Card key={o.id} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="font-extrabold">{o.fullName}</div>
                  <div className="text-sm text-zinc-600">
                    #{o.id.slice(-8).toUpperCase()} • {o.goal}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{o.status}</Badge>
                  <a className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white" href={`/admin/orders/${o.id}`}>
                    Abrir
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
