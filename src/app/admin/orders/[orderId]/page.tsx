"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
// ✅ CORREÇÃO 3: Removemos CardTitle da importação
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [finalText, setFinalText] = useState("");

  useEffect(() => {
    // Verifica se temos o ID antes de buscar
    if (!params?.orderId) return;

    fetch(`/api/admin/orders/${params.orderId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        // Garante que o texto seja carregado (rascunho ou final)
        const draft = data.aiDraftJson as string;
        const final = data.finalWorkoutJson as string;
        setFinalText(final || draft || "");
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [params]);

  async function handleGenerateAI() {
    if (!order?.id) return;
    setGenerating(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/generate-ai`, {
        method: "POST",
      });
      if (res.ok) {
        alert("Treino gerado com sucesso!");
        window.location.reload();
      } else {
        alert("Erro ao gerar. Verifique se configurou a chave da OpenAI.");
      }
    } catch (e) {
      alert("Erro de conexão.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSaveAndSend() {
    if (!order?.id) return;
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
      } else {
        alert("Erro ao salvar.");
      }
    } catch (e) {
      alert("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 font-medium text-zinc-500">Carregando pedido...</div>;
  if (!order) return <div className="p-8 font-medium text-zinc-500">Pedido não encontrado.</div>;

  const parq = order.parqJson || {};

  return (
    <div className="min-h-screen bg-zinc-50 p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Pedido: {order.fullName}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-mono text-zinc-400">{order.id}</span>
            <StatusBadge status={order.status} />
          </div>
        </div>
        <Button 
          className="bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-100" 
          onClick={() => router.push("/admin")}
        >
          Voltar
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Coluna da Esquerda: Dados e PAR-Q */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              {/* ✅ CORREÇÃO 4: Substituímos CardTitle por h3 simples */}
              <h3 className="font-semibold text-lg">Dados do Aluno</h3>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-zinc-700">
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
               <h3 className="font-semibold text-lg text-red-800">PAR-Q (Saúde)</h3>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <CheckItem label="Dor no peito?" value={parq.chestPain} />
              <CheckItem label="Tontura/Desmaio?" value={parq.dizziness} />
              <CheckItem label="Problema Ósseo?" value={parq.jointProblem} />
              <CheckItem label="Medicação Cardíaca?" value={parq.medication} />
              <p className="pt-2 text-zinc-600 italic border-t border-red-100 mt-2">
                Obs: {parq.notes || "Sem observações"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Coluna da Direita: AÇÕES e TREINO */}
        <div className="space-y-6">
          
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
               <h3 className="font-semibold text-lg text-blue-900">Controle do Personal</h3>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm text-blue-700">
                Gere o treino com IA agora mesmo, independente do pagamento.
              </p>
              
              <Button 
                onClick={handleGenerateAI} 
                disabled={generating}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                {generating ? "🤖 Criando Treino..." : "✨ Gerar Treino com IA"}
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col h-full">
             <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="font-semibold text-lg">Treino Final</h3>
                <div className="text-xs text-zinc-400">Edite à vontade</div>
             </CardHeader>
             <CardContent className="flex-1 space-y-4">
                <Textarea 
                  value={finalText}
                  onChange={(e) => setFinalText(e.target.value)}
                  className="min-h-[400px] font-mono text-sm bg-zinc-50"
                  placeholder="O treino gerado aparecerá aqui..."
                />
                
                <Button 
                  onClick={handleSaveAndSend}
                  disabled={saving}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold shadow-md"
                >
                  {saving ? "Salvando..." : "✅ Salvar e Enviar no WhatsApp"}
                </Button>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  // ✅ CORREÇÃO 5: Badge sem 'variant', usando classes diretas
  const colors: Record<string, string> = {
    pending_payment: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    refused: "bg-red-100 text-red-800",
  };
  
  return (
    <Badge className={`${colors[status] || "bg-gray-100"} hover:bg-opacity-80`}>
      {status}
    </Badge>
  );
}

function CheckItem({ label, value }: { label: string, value: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-red-100/50 pb-2 last:border-0">
      <span className="text-zinc-700">{label}</span>
      <span className={value ? "font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded text-xs" : "text-green-600 font-medium"}>
        {value ? "SIM ⚠️" : "Não"}
      </span>
    </div>
  );
}