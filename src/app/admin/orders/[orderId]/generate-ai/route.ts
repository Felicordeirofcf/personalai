import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import OpenAI from "openai";

function buildPrompt(order: any) {
  return `
Gere um treino seguro e objetivo para um aluno.
Responda APENAS com JSON válido (sem markdown).

Formato:
{
  "overview": { "goal": string, "frequencyPerWeek": string, "timePerDayMin": number, "experience": string, "location": string, "equipment": string },
  "safety": { "parqFlags": string[], "notes": string },
  "plan": [
    { "day": string, "focus": string, "durationMin": number, "warmup": string[],
      "workout": [{ "name": string, "sets": number, "reps": string, "restSec": number, "notes": string }],
      "cooldown": string[], "intensity": "leve" | "moderada" | "alta"
    }
  ],
  "progression": string[],
  "extraNotes": string[]
}

Dados do aluno:
Nome: ${order.fullName}
Objetivo: ${order.goal}
Local: ${order.location}
Frequência: ${order.frequency}
Experiência: ${order.experience}
Tempo/dia: ${order.timePerDayMin}
Equipamentos: ${order.equipment}
Limitações: ${order.limitations}

PAR-Q:
${JSON.stringify(order.parqJson ?? {}, null, 2)}
`.trim();
}

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ orderId: string }> }
) {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { orderId } = await ctx.params;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  if (!apiKey) return NextResponse.json({ error: "OPENAI_API_KEY ausente" }, { status: 400 });

  const client = new OpenAI({ apiKey });

  const resp = await client.chat.completions.create({
    model,
    temperature: 0.4,
    messages: [
      { role: "system", content: "Você é um personal trainer e prioriza segurança." },
      { role: "user", content: buildPrompt(order) },
    ],
  });

  const text = resp.choices?.[0]?.message?.content?.trim() || "";
  let json: any;

  try {
    json = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "IA não retornou JSON válido", raw: text.slice(0, 1500) }, { status: 422 });
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { aiDraftJson: json, status: "ai_draft_ready" },
  });

  return NextResponse.json({ ok: true });
}
