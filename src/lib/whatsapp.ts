function onlyDigits(v: string) {
  return (v ?? "").replace(/\D/g, "");
}

/**
 * Normaliza número para padrão BR:
 * - se já vier com 55, mantém
 * - se vier sem DDI, adiciona 55
 */
export function normalizeWhatsAppNumber(raw: string) {
  const digits = onlyDigits(raw);

  if (!digits) return "";

  // já tem DDI?
  if (digits.startsWith("55")) return digits;

  const ddi = process.env.WHATSAPP_DEFAULT_COUNTRY || "55";
  return ddi + digits;
}

/**
 * Envia texto via Evolution API
 * (endpoint pode variar conforme sua versão; este é o mais comum)
 */
export async function sendWhatsAppText(toNumber: string, message: string) {
  const baseUrl = process.env.EVOLUTION_API_URL!;
  const apiKey = process.env.EVOLUTION_API_KEY!;
  const instance = process.env.EVOLUTION_INSTANCE!;

  if (!baseUrl || !apiKey || !instance) {
    throw new Error("EVOLUTION envs ausentes (URL/KEY/INSTANCE).");
  }

  const number = normalizeWhatsAppNumber(toNumber);
  if (!number) throw new Error("Número WhatsApp inválido.");

  // Em várias instalações Evolution, o payload é assim:
  const res = await fetch(`${baseUrl}/message/sendText/${instance}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: apiKey,
    },
    body: JSON.stringify({
      number, // ex: 5521987708652
      text: message,
      delay: 1200,
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Falha ao enviar WhatsApp: ${res.status} ${txt}`);
  }

  return res.json().catch(() => ({}));
}
