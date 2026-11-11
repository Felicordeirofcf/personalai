import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { ProductCard } from "@/components/site/ProductCard";
import { getActiveProducts } from "@/lib/products";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Planilhas de treino prontas | ${site.name}`,
  description: "Planilhas de treino montadas por personal trainer, com entrega imediata em PDF.",
};

export default async function PlanilhasPage() {
  const products = await getActiveProducts();

  return (
    <div className="bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight">Planilhas de treino prontas</h1>
          <p className="mt-3 text-lg text-zinc-600">
            Programas completos montados por mim ({site.cref}). Pagou, recebeu o PDF na hora — e o link também chega
            no seu WhatsApp.
          </p>
        </div>

        {products.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600">
            Novas planilhas chegando em breve. Enquanto isso, conheça o{" "}
            <Link href="/personalizado" className="font-semibold text-emerald-700 underline">
              treino personalizado
            </Link>
            .
          </div>
        )}

        <div className="mt-12 rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
          Não achou a planilha ideal ou tem alguma limitação física?{" "}
          <Link href="/personalizado" className="font-semibold text-emerald-700 underline">
            Peça um treino personalizado
          </Link>{" "}
          montado a partir da sua avaliação.
        </div>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  );
}
