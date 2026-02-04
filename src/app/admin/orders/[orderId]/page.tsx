"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
// ✅ CORREÇÃO 1: Removemos CardTitle da importação
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [finalText, setFinalText] = useState("");

  useEffect(() => {
    // Nota: O params do client-side já vem resolvido, mas garantimos que orderId existe
    if (!params?.orderId) return;

    fetch(`/api/admin/orders/${params.orderId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        // Garante que seja string, mesmo se vier null do banco
        setFinalText((data.finalWorkoutJson as string) || (data.aiDraftJson as string) || "");
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [params]);

  async function handleGenerateAI() {
    setGenerating(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/generate-ai`, {
        method: "POST",
      });
      if (res.ok) {
        alert("Treino gerado com sucesso!");
        window.location.reload();
      } else {
        alert("Erro ao gerar.");
      }
    } catch (e) {
      alert("Erro de conexão.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSaveAndSend() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/save-final`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          finalWorkout: finalText,
          forceStatus: "completed"
        }),
      });
      
      if (res.ok) {
        const textEncoded = encodeURIComponent(finalText);
        const linkZap = `https://wa.me/55${order.whatsapp.replace(/\D/g, "")}?text=${textEncoded}`;
        window.open(linkZap, "_blank");
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8">Carregando pedido...</div>;
  if (!order) return <div className="p-8">Pedido não encontrado.</div>;

  const parq = order.parqJson || {};

  return (
    <div className="min-h-screen bg-zinc-50 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Pedido: {order.fullName}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-zinc-500">{order.id}</span>
            <StatusBadge status={order.status} />
          </div>
        </div>
        <Button className="bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-100" onClick={() => router.push("/admin")}>Voltar</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              {/* ✅ CORREÇÃO 2: Trocamos CardTitle por h3 estilizado */}
              <h3 className="font-semibold text-lg leading-none tracking-tight">Dados do Aluno</h3>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>WhatsApp:</strong> {order.whatsapp}</p>
              <p><strong>Objetivo:</strong> {order.goal}</p>
              <p><strong>Local:</strong> {order.location}</p>
              <p><strong>Equipamentos:</strong> {order.equipment}</p>
              <p><strong>Limitações:</strong> {order.limitations || "Nenhuma"}</p>
            </CardContent>
          </Card>

          <Card className="border-red-100 bg-red-50/30">
            <CardHeader>
               <h3 className="font-semibold text-lg leading-none tracking-tight text-red-800">PAR-Q (Saúde)</h3>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <CheckItem label="Dor no peito?" value={parq.chestPain} />
              <CheckItem label="Tontura/Desmaio?" value={parq.dizziness} />
              <CheckItem label="Problema Ósseo?" value={parq.jointProblem} />
              <CheckItem label="Medicação Cardíaca?" value={parq.medication} />
              <p className="pt-2 text-zinc-600 italic">Obs: {parq.notes || "-"}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
               <h3 className="font-semibold text-lg leading-none tracking-tight text-blue-900">Controle do Personal</h3>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm text-blue-700">
                Gere o treino com IA baseada no PAR-Q acima, edite se necessário e envie.
              </p>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleGenerateAI} 
                  disabled={generating}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {generating ? "🤖 Criando Treino..." : "✨ Gerar Treino com IA"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col h-full">
             <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="font-semibold text-lg leading-none tracking-tight">Treino Final</h3>
                <div className="text-xs text-zinc-400">Edite antes de enviar</div>
             </CardHeader>
             <CardContent className="flex-1">
                <Textarea 
                  value={finalText}
                  onChange={(e) => setFinalText(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="O treino gerado aparecerá aqui..."
                />
                
                <div className="pt-4">
                  <Button 
                    onClick={handleSaveAndSend}
                    disabled={saving}
                    className="w-full bg-green-600 hover:bg-green-700 font-bold"
                  >
                    {saving ? "Salvando..." : "✅ Salvar e Abrir WhatsApp"}
                  </Button>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  // ✅ CORREÇÃO 3: Removemos variant="outline" do Badge e usamos apenas o padrão
  return <Badge className="bg-zinc-100 text-zinc-800 hover:bg-zinc-200 border border-zinc-200">{status}</Badge>;
}

function CheckItem({ label, value }: { label: string, value: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-red-100 pb-1">
      <span>{label}</span>
      <span className={value ? "font-bold text-red-600" : "text-green-600"}>
        {value ? "SIM ⚠️" : "Não"}
      </span>
    </div>
  );
}