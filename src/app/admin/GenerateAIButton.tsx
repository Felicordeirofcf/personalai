"use client";

import { useState } from "react";

export default function GenerateAIButton({
  orderId,
  disabled,
}: {
  orderId: string;
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/generate-ai`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.error || "Erro ao gerar treino IA.");
        return;
      }
      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={generate}
      disabled={disabled || loading}
      className="rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
      title={disabled ? "Confirme o pagamento primeiro" : "Gerar treino IA"}
    >
      {loading ? "Gerando..." : "Gerar treino IA"}
    </button>
  );
}
