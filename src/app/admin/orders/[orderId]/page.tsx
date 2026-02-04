"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
    if (!params?.orderId) return;

    fetch(`/api/admin/orders/${params.orderId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
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
        alert("Erro ao gerar.");
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
      // 1. Salva o treino
      const res = await fetch(`/api/admin/orders/${order.id}/save-final`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          finalWorkout: finalText,
          forceStatus: "completed"
        }),
      });
      
      if (res.ok) {
        // 2. Mensagem Tradicional (Sem link, você anexa o PDF depois)
        const primeiroNome = order.fullName.split(" ")[0];
        const mensagemZap = `Fala ${primeiroNome}! Tudo bem? 💪

Seu planejamento de treino novo está pronto! 🚀
Montei tudo com base no seu objetivo de *${order.goal}*.

Estou te enviando o arquivo PDF aqui em baixo 👇.
Qualquer dúvida, me chama!`;

        const textEncoded = encodeURIComponent(mensagemZap);
        const linkZap = `https://wa.me/55${order.whatsapp.replace(/\D/g, "")}?text=${textEncoded}`;
        
        // 3. Abre o WhatsApp
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
        <div className="space-y-6">
          <Card>
            <CardHeader><h3 className="font-semibold text-lg">Dados do Aluno</h3></CardHeader>
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
            <CardHeader><h3 className="font-semibold text-lg text-red-800">PAR-Q (Saúde)</h3></CardHeader>
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

        <div className="space-y-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader><h3 className="font-semibold text-lg text-blue-900">1. Gerar Treino</h3></CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm text-blue-700">A IA vai ler o PAR-Q e criar o treino seguro abaixo.</p>
              <Button 
                onClick={handleGenerateAI} 
                disabled={generating}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                {generating ? "🤖 Criando..." : "✨ Gerar com IA"}
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col h-full border-green-100">
             <CardHeader className="flex flex-row items-center justify-between bg-green-50/50">
                <h3 className="font-semibold text-lg text-green-900">2. Revisar e Enviar</h3>
                <div className="text-xs text-green-600 font-medium">Fluxo Tradicional</div>
             </CardHeader>
             <CardContent className="flex-1 space-y-4 pt-6">
                
                <div className="space-y-1">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Conteúdo (Edite aqui)</span>
                  <Textarea 
                    value={finalText}
                    onChange={(e) => setFinalText(e.target.value)}
                    className="min-h-[300px] font-mono text-sm bg-white"
                    placeholder="O treino gerado aparecerá aqui..."
                  />
                </div>
                
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100 space-y-3">
                  
                  {/* BOTÃO 1: DOWNLOAD DO PDF (LINK DIRETO) */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-600">A</div>
                    <a 
                      href={`/api/orders/${order.id}/pdf`}
                      target="_blank"
                      download
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full border-zinc-300">
                        📄 Baixar PDF no Celular
                      </Button>
                    </a>
                  </div>

                  {/* BOTÃO 2: SALVAR E ZAP */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-600">B</div>
                    <Button 
                      onClick={handleSaveAndSend}
                      disabled={saving}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold shadow-sm"
                    >
                      {saving ? "Salvando..." : "✅ Salvar e Abrir WhatsApp"}
                    </Button>
                  </div>
                  
                  <p className="text-center text-[10px] text-zinc-400">
                    *Baixe o PDF primeiro, depois anexe na conversa do WhatsApp.
                  </p>
                </div>

             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending_payment: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    refused: "bg-red-100 text-red-800",
  };
  return <Badge className={`${colors[status] || "bg-gray-100"} hover:bg-opacity-80`}>{status}</Badge>;
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