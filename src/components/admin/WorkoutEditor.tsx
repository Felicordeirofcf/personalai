"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function WorkoutEditor({ orderId, initialJson }: { orderId: string; initialJson: any }) {
  const [text, setText] = useState(JSON.stringify(initialJson ?? {}, null, 2));
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch(`/api/admin/orders/${orderId}/update-workout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ finalWorkoutJson: JSON.parse(text) }),
    });
    setSaving(false);
    alert("Salvo!");
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-extrabold">Editor do treino (JSON)</div>
      <div className="text-sm text-zinc-600">
        Você pode ajustar aqui e salvar.
      </div>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[420px]" />
      <Button onClick={save} disabled={saving}>
        {saving ? "Salvando..." : "Salvar versão final"}
      </Button>
    </div>
  );
}
