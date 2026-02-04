"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const schema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  whatsapp: z.string().min(8),

  goal: z.string().min(2),
  location: z.enum(["casa", "academia", "misto"]),
  frequency: z.enum(["2-3", "4-5", "6+"]),
  experience: z.enum(["iniciante", "intermediario", "avancado"]),
  timePerDayMin: z.coerce.number().int().min(15).max(180),
  equipment: z.string().min(2),
  limitations: z.string().optional().default(""),

  // PAR-Q básico
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
}: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-3">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm text-zinc-800">{label}</span>
    </label>
  );
}

export default function ParqWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      location: "casa",
      frequency: "2-3",
      experience: "iniciante",
      timePerDayMin: 45,
      parq_chestPain: false,
      parq_dizziness: false,
      parq_jointProblem: false,
      parq_medication: false,
      parq_otherReason: false,
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
      const payload = {
        ...data,
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

      if (!res.ok) throw new Error("Falha ao criar pedido");
      const json = await res.json();
      window.location.href = `/checkout/${json.orderId}`;
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="text-lg font-extrabold">Começar avaliação</div>
          <Badge>Passo {step}/3</Badge>
        </div>
        <div className="text-sm text-zinc-600">
          Você preenche o básico, realiza o pagamento e eu reviso antes de enviar o treino.
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {step === 1 && (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label>Nome</Label>
                <Input {...form.register("fullName")} placeholder="Seu nome completo" />
              </div>
              <div className="space-y-1">
                <Label>WhatsApp</Label>
                <Input {...form.register("whatsapp")} placeholder="DDD + número" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label>Email</Label>
                <Input {...form.register("email")} placeholder="seuemail@exemplo.com" />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                onClick={async () => {
                  const ok = await form.trigger(["fullName", "whatsapp", "email"]);
                  if (ok) setStep(2);
                }}
              >
                Próximo
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label>Objetivo</Label>
                <Input {...form.register("goal")} placeholder="Ex.: emagrecer, força, condicionamento..." />
              </div>

              <div className="space-y-1">
                <Label>Tempo por sessão (min)</Label>
                <Input type="number" {...form.register("timePerDayMin")} />
              </div>

              <div className="space-y-1">
                <Label>Onde vai treinar?</Label>
                <select
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm"
                  {...form.register("location")}
                >
                  <option value="casa">Em casa</option>
                  <option value="academia">Academia</option>
                  <option value="misto">Misto</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label>Frequência semanal</Label>
                <select
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm"
                  {...form.register("frequency")}
                >
                  <option value="2-3">2–3 dias</option>
                  <option value="4-5">4–5 dias</option>
                  <option value="6+">6+ dias</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label>Nível</Label>
                <select
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm"
                  {...form.register("experience")}
                >
                  <option value="iniciante">Iniciante</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <Label>Equipamentos disponíveis</Label>
                <Input {...form.register("equipment")} placeholder="Ex.: halteres, elástico, academia completa..." />
              </div>

              <div className="space-y-1 md:col-span-2">
                <Label>Limitações / dores (se houver)</Label>
                <Textarea {...form.register("limitations")} placeholder="Ex.: dor no joelho, lombar, etc." />
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Voltar
              </Button>
              <Button
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
            <div className="space-y-2">
              <div className="text-sm font-extrabold">PAR-Q (básico)</div>

              <Check
                label="Sente dores no peito ao fazer atividade física?"
                value={values.parq_chestPain}
                onChange={(v) => form.setValue("parq_chestPain", v)}
              />
              <Check
                label="Sente tontura/desmaio durante esforço?"
                value={values.parq_dizziness}
                onChange={(v) => form.setValue("parq_dizziness", v)}
              />
              <Check
                label="Tem problema articular/ósseo que piora com exercício?"
                value={values.parq_jointProblem}
                onChange={(v) => form.setValue("parq_jointProblem", v)}
              />
              <Check
                label="Usa medicação para pressão/coração ou condição relevante?"
                value={values.parq_medication}
                onChange={(v) => form.setValue("parq_medication", v)}
              />
              <Check
                label="Existe algum outro motivo para não fazer exercício sem orientação?"
                value={values.parq_otherReason}
                onChange={(v) => form.setValue("parq_otherReason", v)}
              />

              <div className="space-y-1">
                <Label>Observações (opcional)</Label>
                <Textarea {...form.register("parq_notes")} placeholder="Se quiser, detalhe algo importante..." />
              </div>

              {hasParqAlert && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  Você marcou itens no PAR-Q. Eu vou revisar com cuidado e posso pedir liberação caso necessário.
                </div>
              )}
            </div>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                Voltar
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={loading}
              >
                {loading ? "Enviando..." : "Continuar para pagamento"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
