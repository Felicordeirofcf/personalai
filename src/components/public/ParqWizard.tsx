"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const schema = z.object({
  fullName: z.string().min(3, "Nome muito curto"),
  email: z.string().email("Email inválido"),
  whatsapp: z.string().min(8, "Telefone inválido"),
  cpf: z.string().min(11, "CPF inválido (apenas números)"),

  goal: z.string().min(2, "Informe o objetivo"),
  location: z.enum(["casa", "academia", "misto"]),
  frequency: z.enum(["2-3", "4-5", "6+"]),
  experience: z.enum(["iniciante", "intermediario", "avancado"]),
  timePerDayMin: z.coerce.number().int().min(15).max(180),
  equipment: z.string().min(2, "Informe os equipamentos"),
  limitations: z.string().optional().default(""),

  parq_chestPain: z.boolean().default(false),
  parq_dizziness: z.boolean().default(false),
  parq_jointProblem: z.boolean().default(false),
  parq_medication: z.boolean().default(false),
  parq_otherReason: z.boolean().default(false),
  parq_notes: z.string().optional().default(""),
});

type FormData = z.infer<typeof schema>;

function Check({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-3 cursor-pointer hover:bg-zinc-50 transition-colors">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm text-zinc-800 leading-snug">{label}</span>
    </label>
  );
}

export default function ParqWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // ✅ CORREÇÃO: 'as any' no resolver para evitar conflito de tipos estritos do TypeScript
  const form = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      fullName: "",
      email: "",
      whatsapp: "",
      cpf: "",
      goal: "",
      equipment: "",
      location: "casa",
      frequency: "2-3",
      experience: "iniciante",
      timePerDayMin: 45,
      parq_chestPain: false,
      parq_dizziness: false,
      parq_jointProblem: false,
      parq_medication: false,
      parq_otherReason: false,
      limitations: "",
      parq_notes: "",
    },
  });

  const values = form.watch();

  const hasParqAlert = useMemo(() => {
    return (
      values.parq_chestPain ||
      values.parq_dizziness ||
      values.parq_jointProblem ||
      values.parq_medication ||
      values.parq_otherReason
    );
  }, [values]);

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const cleanCpf = data.cpf.replace(/\D/g, "");

      const payload = {
        ...data,
        cpf: cleanCpf,
        limitations: data.limitations || "",
        parq: {
          chestPain: data.parq_chestPain,
          dizziness: data.parq_dizziness,
          jointProblem: data.parq_jointProblem,
          medication: data.parq_medication,
          otherReason: data.parq_otherReason,
          notes: data.parq_notes || "",
        },
      };

      const res = await fetch("/api/public/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Erro: " + (err.error || "Falha ao criar pedido"));
        return;
      }

      const json = await res.json();
      
      if (json.checkoutUrl) {
         window.location.href = json.checkoutUrl;
      } else {
         window.location.href = `/checkout/${json.orderId}`;
      }
      
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao enviar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="overflow-hidden border-0 shadow-xl sm:border sm:border-t-4 sm:border-t-[#1B3B5A] sm:shadow-sm">
      
      <CardHeader className="flex flex-col items-center gap-4 px-4 pt-8 sm:px-6 text-center">
        
        <div className="flex flex-col items-center">
          <div className="relative mb-2 h-20 w-20 rounded-full overflow-hidden shadow-sm border border-zinc-100">
             <Image 
               src="/logo.png" 
               alt="Logo Felipe Ferreira Personal" 
               fill
               className="object-cover p-1"
             />
          </div>
          
          <h1 className="text-2xl font-extrabold text-[#1B3B5A] leading-tight">
            Felipe Ferreira
          </h1>
          <Badge className="mt-1 bg-zinc-100 text-zinc-600 font-medium tracking-wider hover:bg-zinc-200">
            CREF 071550-RJ
          </Badge>
        </div>

        <div className="h-px w-full max-w-[200px] bg-zinc-100 my-2" />

        <div className="flex flex-col gap-1 items-center">
            <h2 className="text-lg font-bold text-zinc-900">
              Consultoria Híbrida
            </h2>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Avaliação Inicial • Passo {step} de 3
            </p>
        </div>
        
        <div className="mt-2 rounded-lg bg-[#F5F8FA] p-4 text-sm text-zinc-600 leading-relaxed border border-[#E1E8ED]">
          Ao preencher os dados abaixo, você garante um planejamento exclusivo (nada de treino de gaveta!) e ganha 
          <strong className="text-[#1B3B5A] font-bold"> 1 mês de acompanhamento semanal diretamente comigo no WhatsApp </strong> 
          para ajustes. Tudo isso por apenas <strong className="text-zinc-900">R$ 50,00</strong>.
        </div>

      </CardHeader>

      <CardContent className="space-y-4 px-4 pb-8 sm:px-6 pt-2">
        {step === 1 && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Nome Completo</Label>
                <Input
                  {...form.register("fullName")}
                  placeholder="Seu nome"
                  className="bg-zinc-50/50"
                />
                {form.formState.errors.fullName && (
                  <p className="text-xs text-red-500">{form.formState.errors.fullName.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>WhatsApp</Label>
                <Input
                  {...form.register("whatsapp")}
                  placeholder="(11) 99999-9999"
                  className="bg-zinc-50/50"
                />
                {form.formState.errors.whatsapp && (
                  <p className="text-xs text-red-500">{form.formState.errors.whatsapp.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  {...form.register("email")}
                  placeholder="seu@email.com"
                  type="email"
                  className="bg-zinc-50/50"
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>CPF (Somente números)</Label>
                <Input
                  {...form.register("cpf")}
                  placeholder="000.000.000-00"
                  className="bg-zinc-50/50"
                  maxLength={14}
                />
                {form.formState.errors.cpf && (
                  <p className="text-xs text-red-500">{form.formState.errors.cpf.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                className="w-full sm:w-auto font-bold bg-[#1B3B5A] hover:bg-[#142C44]"
                onClick={async () => {
                  const ok = await form.trigger(["fullName", "whatsapp", "email", "cpf"]);
                  if (ok) setStep(2);
                }}
              >
                Continuar Avaliação
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Objetivo Principal</Label>
                <Input
                  {...form.register("goal")}
                  placeholder="Ex: Hipertrofia, emagrecimento..."
                />
                {form.formState.errors.goal && (
                  <p className="text-xs text-red-500">{form.formState.errors.goal.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Tempo disponível (min/dia)</Label>
                <Input
                  type="number"
                  {...form.register("timePerDayMin")}
                  placeholder="45"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Local de Treino</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  {...form.register("location")}
                >
                  <option value="casa">Em casa</option>
                  <option value="academia">Academia</option>
                  <option value="misto">Misto (Casa + Academia)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Frequência Semanal</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  {...form.register("frequency")}
                >
                  <option value="2-3">2 a 3 vezes</option>
                  <option value="4-5">4 a 5 vezes</option>
                  <option value="6+">6 vezes ou mais</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Nível de Experiência</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  {...form.register("experience")}
                >
                  <option value="iniciante">Iniciante (Começando agora)</option>
                  <option value="intermediario">Intermediário (Treina há 6 meses+)</option>
                  <option value="avancado">Avançado (Treina há anos)</option>
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label>Equipamentos Disponíveis</Label>
                <Input
                  {...form.register("equipment")}
                  placeholder="Ex: Apenas do corpo, halteres, barra..."
                />
                {form.formState.errors.equipment && (
                  <p className="text-xs text-red-500">{form.formState.errors.equipment.message}</p>
                )}
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label>Limitações ou Lesões (Opcional)</Label>
                <Textarea
                  {...form.register("limitations")}
                  placeholder="Ex: Tenho condromalácia no joelho direito..."
                />
              </div>
            </div>

            <div className="flex justify-between gap-3 pt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="w-1/3">
                Voltar
              </Button>
              <Button
                className="w-2/3 bg-[#1B3B5A] hover:bg-[#142C44] font-bold"
                onClick={async () => {
                  const ok = await form.trigger([
                    "goal",
                    "timePerDayMin",
                    "location",
                    "frequency",
                    "experience",
                    "equipment",
                  ]);
                  if (ok) setStep(3);
                }}
              >
                Próximo
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="space-y-4">
              <div className="text-sm font-semibold text-zinc-900 border-b pb-2">
                Questionário de Prontidão (PAR-Q)
              </div>

              <div className="grid gap-3">
                <Check
                  label="Algum médico já disse que você possui algum problema de coração?"
                  value={values.parq_chestPain ?? false}
                  onChange={(v) => form.setValue("parq_chestPain", v)}
                />
                <Check
                  label="Você sente dores no peito quando pratica atividade física?"
                  value={values.parq_dizziness ?? false}
                  onChange={(v) => form.setValue("parq_dizziness", v)}
                />
                <Check
                  label="No último mês, sentiu dor no peito mesmo em repouso?"
                  value={values.parq_jointProblem ?? false}
                  onChange={(v) => form.setValue("parq_jointProblem", v)}
                />
                <Check
                  label="Você apresenta desequilíbrio devido a tontura ou perda de consciência?"
                  value={values.parq_medication ?? false}
                  onChange={(v) => form.setValue("parq_medication", v)}
                />
                <Check
                  label="Possui algum problema ósseo ou articular que pode piorar com exercício?"
                  value={values.parq_otherReason ?? false}
                  onChange={(v) => form.setValue("parq_otherReason", v)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Observações Adicionais (Opcional)</Label>
                <Textarea
                  {...form.register("parq_notes")}
                  placeholder="Algo mais que eu deva saber sobre sua saúde?"
                />
              </div>

              {hasParqAlert && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 flex items-start gap-2">
                  <span>⚠️</span>
                  <span>
                    Você marcou itens de atenção no PAR-Q. O treino será adaptado com cautela extra.
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-between gap-3 pt-4">
              <Button variant="outline" onClick={() => setStep(2)} className="w-1/3" disabled={loading}>
                Voltar
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={loading}
                className="w-2/3 bg-green-600 hover:bg-green-700 font-bold shadow-md"
              >
                {loading ? "Processando..." : "Ir para Pagamento (R$ 50,00)"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}