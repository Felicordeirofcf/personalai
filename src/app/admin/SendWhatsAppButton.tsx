"use client";

import { useState } from "react";

export default function SendWhatsAppButton({ orderId, phone }: { orderId: string; phone: string }) {
  const [loading, setLoading] = useState(false);

  async function openWhats() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/whatsapp-text`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return alert(data?.error || "Erro ao gerar texto.");

      const text = encodeURIComponent(String(data.text || ""));
      const digits = String(phone || "").replace(/\D/g, "");

      // wa.me exige número com DDI. Se o usuário colocar 55..., perfeito.
      const url = `https://wa.me/${digits}?text=${text}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={openWhats}
      disabled={loading}
      className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50 disabled:opacity-60"
    >
      {loading ? "Abrindo..." : "Enviar WhatsApp (1 clique)"}
    </button>
  );
}
