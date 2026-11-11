"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BuyForm({ productSlug, priceLabel }: { productSlug: string; priceLabel: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      productSlug,
      fullName: String(fd.get("fullName") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      whatsapp: String(fd.get("whatsapp") ?? "").replace(/\D/g, ""),
      cpf: String(fd.get("cpf") ?? "").replace(/\D/g, ""),
    };

    if (payload.cpf.length !== 11) return setError("Informe um CPF válido (11 números).");
    if (payload.whatsapp.length < 10) return setError("Informe o WhatsApp com DDD.");

    setLoading(true);
    try {
      const res = await fetch("/api/public/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.checkoutUrl) {
        setError(json.error || "Não foi possível iniciar o pagamento. Tente novamente.");
        return;
      }
      window.location.href = json.checkoutUrl;
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="fullName">Nome completo</Label>
        <Input id="fullName" name="fullName" required minLength={3} autoComplete="name" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input id="whatsapp" name="whatsapp" required placeholder="(21) 99999-9999" autoComplete="tel" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="cpf">CPF</Label>
          <Input id="cpf" name="cpf" required placeholder="000.000.000-00" maxLength={14} inputMode="numeric" />
        </div>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-emerald-600 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-emerald-700 disabled:opacity-60"
      >
        {loading ? "Gerando pagamento..." : `Comprar agora por ${priceLabel}`}
      </button>
      <p className="text-center text-xs text-zinc-500">
        Pix, cartão ou boleto via Asaas • CPF exigido para emissão da cobrança
      </p>
    </form>
  );
}
