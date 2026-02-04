import OpenAI from "openai";
import { env } from "./env";

export function getOpenAIClient() {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY não configurada no .env");
  }
  return new OpenAI({ apiKey: env.OPENAI_API_KEY });
}

// Schema do treino para garantir resposta consistente
export const workoutSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    profileSummary: { type: "string" },
    safetyNotes: { type: "array", items: { type: "string" } },

    schedule: {
      type: "object",
      additionalProperties: false,
      properties: {
        daysPerWeek: { type: "number" },
        timePerSessionMin: { type: "number" },
        split: { type: "string" },
      },
      required: ["daysPerWeek", "timePerSessionMin", "split"],
    },

    warmup: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          durationMin: { type: "number" },
          notes: { type: "string" },
        },
        required: ["name", "durationMin", "notes"],
      },
    },

    workouts: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          focus: { type: "string" },
          exercises: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                exercise: { type: "string" },
                sets: { type: "string" },
                reps: { type: "string" },
                restSec: { type: "number" },
                tempo: { type: "string" },
                cues: { type: "array", items: { type: "string" } },
                alternatives: { type: "array", items: { type: "string" } },
              },
              required: ["exercise", "sets", "reps", "restSec", "tempo", "cues", "alternatives"],
            },
          },
          finisher: { type: "string" },
        },
        required: ["name", "focus", "exercises", "finisher"],
      },
    },

    progression: {
      type: "object",
      additionalProperties: false,
      properties: {
        week1: { type: "string" },
        week2: { type: "string" },
        week3: { type: "string" },
        deloadOrTest: { type: "string" },
      },
      required: ["week1", "week2", "week3", "deloadOrTest"],
    },

    habits: { type: "array", items: { type: "string" } },
  },
  required: ["title", "profileSummary", "safetyNotes", "schedule", "warmup", "workouts", "progression", "habits"],
} as const;

export async function generateWorkoutDraft(input: {
  fullName: string;
  goal: string;
  location: string;
  frequency: string;
  experience: string;
  timePerDayMin: number;
  equipment: string;
  limitations: string;
  parq: any;
}) {
  const client = getOpenAIClient();

  const system = `
Você é um professor de Educação Física experiente e cuidadoso.
Gere um treino seguro, objetivo e fácil de executar.
Regras:
- Seja conservador em pessoas iniciantes, com dor/limitações ou PAR-Q com alertas.
- Use linguagem simples (pt-BR), sem promessas milagrosas.
- Sempre inclua alternativas de exercícios.
- Priorize segurança, técnica e progressão gradual.
- Não prescreva dieta clínica. Pode sugerir hábitos gerais.
Retorne SOMENTE JSON válido conforme o schema.
`;

  const user = {
    profile: input,
  };

  const res = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    input: [
      { role: "system", content: system },
      { role: "user", content: JSON.stringify(user) },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "WorkoutPlan",
        schema: workoutSchema,
        strict: true,
      },
    },
  });

  // responses API retorna texto estruturado em output_text
  const jsonText = res.output_text;
  return JSON.parse(jsonText);
}
