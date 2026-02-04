"use client";

import { useState } from "react";

export default function SendWhatsAppButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");

  async function send() {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/send-whatsapp`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(data?.error || "Erro ao enviar.");
        return;
      }

      setMsg("✅ Enviado no WhatsApp!");
      // opcional: recarregar para atualizar status
      window.location.reload();
    } catch (e: any) {
      setMsg(e?.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={send}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Enviando..." : "Enviar no WhatsApp"}
      </button>

      {msg && <div className="text-xs text-zinc-600">{msg}</div>}
    </div>
  );
}
