import "server-only";

function must(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export function getAsaasBaseUrl() {
  const env = (process.env.ASAAS_ENV ?? "sandbox").toLowerCase();
  return env === "production"
    ? "https://api.asaas.com/v3"
    : "https://api-sandbox.asaas.com/v3";
}

export async function asaasFetch<T>(path: string, init?: RequestInit & { body?: any }): Promise<T> {
  const url = `${getAsaasBaseUrl()}${path}`;
  const apiKey = must("ASAAS_API_KEY");

  const res = await fetch(url, {
    ...init,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...(init?.headers ?? {}),
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });

  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) throw new Error(`Asaas ${res.status}: ${typeof data === "string" ? data : JSON.stringify(data)}`);
  return data as T;
}

const ONE_BY_ONE_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO6W6fYAAAAASUVORK5CYII=";

export async function createAsaasCheckout(input: {
  orderId: string;
  fullName: string;
  email: string;
  whatsapp: string;
  valueBRL: number;
  appBaseUrl: string;
}) {
  const created = await asaasFetch<{ id: string }>("/checkouts", {
    method: "POST",
    body: {
      billingTypes: ["PIX", "CREDIT_CARD"],
      chargeTypes: ["DETACHED"],
      minutesToExpire: 60,
      externalReference: input.orderId,
      callback: {
        successUrl: `${input.appBaseUrl}/status/${input.orderId}`,
        cancelUrl: `${input.appBaseUrl}/status/${input.orderId}`,
        expiredUrl: `${input.appBaseUrl}/status/${input.orderId}`,
      },
      items: [
        {
          name: "Treino Único",
          description: "Treino personalizado (PAR-Q + objetivos).",
          quantity: 1,
          value: Number(input.valueBRL.toFixed(2)),
          imageBase64: ONE_BY_ONE_PNG_BASE64,
          externalReference: `item_${input.orderId}`,
        },
      ],
      customerData: {
        name: input.fullName,
        email: input.email,
        phone: input.whatsapp,
      },
    },
  });

  const checkoutUrl = `https://asaas.com/checkoutSession/show?id=${created.id}`;
  return { id: created.id, checkoutUrl };
}
