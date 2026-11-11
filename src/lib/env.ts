import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  ADMIN_EMAIL: z.string(),
  ADMIN_PASSWORD: z.string(),
  JWT_SECRET: z.string().min(20),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),
  PAYMENT_METHOD_LABEL: z.string().default("Pix/Transferência"),
  PIX_RECEIVER_NAME: z.string().default(""),
  PIX_KEY: z.string().default(""),
  BANK_INSTRUCTIONS: z.string().default(""),
  APP_BASE_URL: z.string().default("http://localhost:3000"),
});

type Env = z.infer<typeof envSchema>;
let cached: Env | null = null;

// Valida só quando alguma variável é lida (o build não precisa das chaves de produção)
export const env = new Proxy({} as Env, {
  get(_target, key: string) {
    cached ??= envSchema.parse(process.env);
    return cached[key as keyof Env];
  },
});