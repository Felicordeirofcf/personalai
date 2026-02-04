"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  orderId: string;
  className?: string;
  label?: string;
};

export default function GenerateAIButton({
  orderId,
  className,
  label = "Gerar treino com IA",
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onClick() {
    setErr(null);
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/generate-ai`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}), // futuro: você pode passar options aqui
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const m =
          data?.error ||
          data?.message ||
          `Falha ao gerar (HTTP ${res.status}).`;
        throw new Error(m);
      }

      setMsg("✅ Treino gerado! Atualizando...");
      // Atualiza a tela do admin para puxar o novo aiDraftJson/status
      router.refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Erro ao gerar treino.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className={[
          "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold",
          "border border-zinc-200 bg-white hover:bg-zinc-50",
          "disabled:opacity-60 disabled:cursor-not-allowed",
        ].join(" ")}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
            Gerando...
          </>
        ) : (
          <>
            <span className="text-base">✨</span>
            {label}
          </>
        )}
      </button>

      {msg ? (
        <div className="text-xs text-emerald-700">{msg}</div>
      ) : null}

      {err ? (
        <div className="text-xs text-red-600">
          ❌ {err}
          <div className="mt-1 text-[11px] text-zinc-500">
            Dica: verifique se a rota{" "}
            <span className="font-mono">/api/admin/orders/[orderId]/generate-ai</span>{" "}
            existe e se o <span className="font-mono">OPENAI_API_KEY</span> está configurado.
          </div>
        </div>
      ) : null}
    </div>
  );
}
