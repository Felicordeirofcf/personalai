"use client";

import { useState } from "react";

export default function GenerateAIButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/generate-ai`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) alert(data?.error || "Erro ao gerar IA.");
      else window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={run}
      disabled={loading}
      className="rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
    >
      {loading ? "Gerando..." : "Gerar treino com IA"}
    </button>
  );
}
