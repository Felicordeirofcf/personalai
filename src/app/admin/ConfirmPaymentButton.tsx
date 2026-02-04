"use client";

import { useState } from "react";

export default function ConfirmPaymentButton({
  orderId,
  disabled,
}: {
  orderId: string;
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function confirm() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/confirm-payment`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.error || "Erro ao confirmar pagamento.");
        return;
      }
      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={confirm}
      disabled={disabled || loading}
      className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50 disabled:opacity-60"
      title={disabled ? "Disponível apenas quando estiver 'Aguardando pagamento'" : "Confirmar pagamento"}
    >
      {loading ? "Confirmando..." : "Confirmar pagamento"}
    </button>
  );
}
