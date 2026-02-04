"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  orderId: string;
  aiDraftJson?: any;
  finalWorkoutJson?: any;
  status: string;
};

function pretty(v: any) {
  try {
    return JSON.stringify(v ?? {}, null, 2);
  } catch {
    return "{}";
  }
}

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

export default function WorkoutReviewPanel({
  orderId,
  aiDraftJson,
  finalWorkoutJson,
  status,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [finalText, setFinalText] = useState<string>(pretty(finalWorkoutJson ?? aiDraftJson ?? {}));
  const [whatsText, setWhatsText] = useState<string>("");

  useEffect(() => {
    setFinalText(pretty(finalWorkoutJson ?? aiDraftJson ?? {}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const canSave = useMemo(() => finalText.trim().length > 2, [finalText]);

  async function generateAI() {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/generate-ai`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setMsg(data?.error || "Erro ao gerar IA.");
      setMsg("✅ Rascunho IA gerado. Recarregando...");
      window.location.reload();
    } catch (e: any) {
      setMsg(e?.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  async function saveFinal() {
    setLoading(true);
    setMsg("");
    try {
      let parsed: any;
      try {
        parsed = JSON.parse(finalText);
      } catch {
        return setMsg("❌ JSON inválido. Corrija antes de salvar.");
      }

      const res = await fetch(`/api/admin/orders/${orderId}/save-final`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finalWorkoutJson: parsed }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setMsg(data?.error || "Erro ao salvar.");

      setMsg("✅ Treino final salvo!");
      window.location.reload();
    } catch (e: any) {
      setMsg(e?.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  async function buildWhatsText() {
    setMsg("");
    try {
      let parsed: any;
      try {
        parsed = JSON.parse(finalText);
      } catch {
        return setMsg("❌ JSON inválido. Corrija antes de gerar a mensagem.");
      }

      const res = await fetch(`/api/admin/orders/${orderId}/build-whatsapp-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workoutJson: parsed }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setMsg(data?.error || "Erro ao gerar texto.");

      setWhatsText(data.text || "");
      setMsg("✅ Texto pronto para WhatsApp gerado.");
    } catch (e: any) {
      setMsg((e as any)?.message || "Erro inesperado.");
    }
  }

  async function copyWhats() {
    if (!whatsText) return;
    await copyToClipboard(whatsText);
    setMsg("✅ Copiado! Agora é só colar no WhatsApp.");
  }

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            IA → revisão → envio manual
          </div>
          <div className="mt-1 text-sm text-zinc-600">
            Status atual: <b>{status}</b>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={generateAI}
            disabled={loading}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50 disabled:opacity-60"
          >
            {loading ? "Aguarde..." : "Gerar treino com IA"}
          </button>

          <button
            onClick={saveFinal}
            disabled={loading || !canSave}
            className="rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            Salvar treino final
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Rascunho IA (somente leitura)
          </div>
          <pre className="mt-2 max-h-[420px] overflow-auto text-xs">
            {pretty(aiDraftJson ?? {})}
          </pre>
        </div>

        <div className="rounded-2xl border border-zinc-200 p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Treino final (edite e salve)
          </div>
          <textarea
            value={finalText}
            onChange={(e) => setFinalText(e.target.value)}
            className="mt-2 h-[420px] w-full resize-none rounded-xl border border-zinc-200 bg-white p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-zinc-200"
            spellCheck={false}
          />
          <div className="mt-2 text-xs text-zinc-500">
            Dica: mantenha o JSON válido.
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 p-4 space-y-3">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Mensagem pronta para WhatsApp (manual)
            </div>
            <div className="text-sm text-zinc-600 mt-1">
              Clique para gerar e depois copie/cole no WhatsApp.
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={buildWhatsText}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
            >
              Gerar texto WhatsApp
            </button>

            <button
              onClick={copyWhats}
              disabled={!whatsText}
              className="rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              Copiar
            </button>
          </div>
        </div>

        <textarea
          value={whatsText}
          readOnly
          className="h-[220px] w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm outline-none"
        />
      </div>

      {msg && (
        <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700">
          {msg}
        </div>
      )}
    </div>
  );
}
