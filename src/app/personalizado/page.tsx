import type { Metadata } from "next";
import ParqWizard from "@/components/public/ParqWizard";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { MobileCtaBar } from "@/components/site/MobileCtaBar";
import { personalizedPriceCents, site } from "@/lib/site";
import { formatBRL } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Treino personalizado | ${site.name}`,
  description: "Treino montado a partir da sua avaliação e revisado por personal trainer. Receba em PDF no WhatsApp.",
};

export default function PersonalizadoPage() {
  const price = formatBRL(personalizedPriceCents());

  return (
    <div className="bg-zinc-50 pb-24 md:pb-0">
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-2 lg:items-start">
        <div className="space-y-6">
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            TREINO 100% PERSONALIZADO
          </span>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
            Um treino montado para o seu corpo, sua rotina e seu objetivo.
          </h1>
          <p className="text-lg text-zinc-600">
            Você responde a avaliação ao lado, faz o pagamento e eu monto seu planejamento — revisado por mim antes de
            chegar no seu WhatsApp.
          </p>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <div className="text-sm text-zinc-500">Investimento</div>
            <div className="text-4xl font-extrabold">{price}</div>
            <ul className="mt-4 space-y-2 text-sm text-zinc-700">
              <li>✓ Divisão de treino de acordo com seus dias disponíveis</li>
              <li>✓ Exercícios adaptados ao local e equipamentos que você tem</li>
              <li>✓ Ajustes para dores e limitações (PAR-Q)</li>
              <li>✓ Séries, repetições, descanso e progressão</li>
              <li>✓ PDF enviado no WhatsApp</li>
              <li>✓ Garantia de {site.guaranteeDays} dias</li>
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["1) Avaliação", "Preencha ao lado (3 min)."],
              ["2) Pagamento", "Pix, cartão ou boleto."],
              ["3) Entrega", "PDF no seu WhatsApp."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className="text-sm font-extrabold">{t}</div>
                <div className="text-xs text-zinc-600">{d}</div>
              </div>
            ))}
          </div>
        </div>

        <div id="avaliacao" className="scroll-mt-20 lg:sticky lg:top-24">
          <ParqWizard />
        </div>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
      <MobileCtaBar href="#avaliacao" label={`Começar minha avaliação • ${price}`} note="Leva 3 minutos" />
    </div>
  );
}
