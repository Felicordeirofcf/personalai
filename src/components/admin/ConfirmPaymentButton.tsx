"use client";

import { useState } from "react";

export default function ConfirmPaymentButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  async function confirm() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/confirm-payment`, { method: "POST" });
      if (!res.ok) alert("Erro ao confirmar.");
      else window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={confirm}
      disabled={loading}
      className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50 disabled:opacity-60"
    >
      {loading ? "Confirmando..." : "Confirmar pagamento (manual)"}
    </button>
  );
}
