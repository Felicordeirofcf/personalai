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

export default function WorkoutReviewPanel({ orderId, aiDraftJson, finalWorkoutJson, status }: Props) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [finalText, setFinalText] = useState(pretty(finalWorkoutJson ?? aiDraftJson ?? {}));

  useEffect(() => {
    setFinalText(pretty(finalWorkoutJson ?? aiDraftJson ?? {}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const canSave = useMemo(() => finalText.trim().length > 2, [finalText]);

  async function saveFinal() {
    setLoading(true);
    setMsg("");
    try {
      let parsed: any;
      try {
        parsed = JSON.parse(finalText);
      } catch {
        setMsg("❌ JSON inválido. Corrija antes de salvar.");
        return;
      }

      const res = await fetch(`/api/admin/orders/${orderId}/save-final`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finalWorkoutJson: parsed }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) setMsg(data?.error || "Erro ao salvar.");
      else {
        setMsg("✅ Treino final salvo!");
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Revisão do treino
          </div>
          <div className="text-sm text-zinc-600 mt-1">
            Status atual: <b>{status}</b>
          </div>
        </div>

        <button
          onClick={saveFinal}
          disabled={loading || !canSave}
          className="rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Salvando..." : "Salvar treino final"}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Rascunho IA (somente leitura)
          </div>
          <pre className="mt-2 max-h-[420px] overflow-auto text-xs">{pretty(aiDraftJson ?? {})}</pre>
        </div>

        <div className="rounded-2xl border border-zinc-200 p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Treino final (edite aqui)
          </div>
          <textarea
            value={finalText}
            onChange={(e) => setFinalText(e.target.value)}
            className="mt-2 h-[420px] w-full resize-none rounded-xl border border-zinc-200 bg-white p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-zinc-200"
            spellCheck={false}
          />
        </div>
      </div>

      {msg && (
        <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700">
          {msg}
        </div>
      )}
    </div>
  );
}
