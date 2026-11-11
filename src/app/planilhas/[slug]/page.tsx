import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { MobileCtaBar } from "@/components/site/MobileCtaBar";
import { BuyForm } from "@/components/site/BuyForm";
import { site } from "@/lib/site";
import { formatBRL } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({ where: { slug } }).catch(() => null);
  return product && product.active ? product : null;
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) return { title: site.title };
  return {
    title: `${product.title} | ${site.name}`,
    description: product.subtitle || product.description.slice(0, 150),
  };
}

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const price = formatBRL(product.priceCents);
  const facts = [
    product.level && ["Nível", product.level],
    product.location && ["Local", product.location],
    product.durationWeeks && ["Duração", `${product.durationWeeks} semanas`],
    ["Formato", "PDF (celular ou impresso)"],
  ].filter(Boolean) as [string, string][];

  return (
    <div className="bg-zinc-50 pb-24 md:pb-0">
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">{product.title}</h1>
          {product.subtitle ? <p className="mt-3 text-lg text-zinc-600">{product.subtitle}</p> : null}

          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {facts.map(([k, v]) => (
              <div key={k} className="rounded-xl border border-zinc-200 bg-white p-3">
                <dt className="text-xs text-zinc-500">{k}</dt>
                <dd className="text-sm font-semibold">{v}</dd>
              </div>
            ))}
          </dl>

          {product.highlights.length > 0 ? (
            <div className="mt-8">
              <h2 className="text-xl font-extrabold">O que você recebe</h2>
              <ul className="mt-3 space-y-2">
                {product.highlights.map((h) => (
                  <li key={h} className="flex gap-2 text-zinc-700">
                    <span className="text-emerald-600">✓</span> {h}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {product.description ? (
            <div className="mt-8 whitespace-pre-line leading-relaxed text-zinc-700">{product.description}</div>
          ) : null}

          <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
            <strong>Garantia de {site.guaranteeDays} dias:</strong> não gostou, devolvo seu dinheiro. É só chamar no
            WhatsApp.
          </div>
        </div>

        <aside id="comprar" className="scroll-mt-20 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg">
            {product.compareAtCents && product.compareAtCents > product.priceCents ? (
              <div className="text-sm text-zinc-400 line-through">{formatBRL(product.compareAtCents)}</div>
            ) : null}
            <div className="text-4xl font-extrabold">{price}</div>
            <div className="mb-5 mt-1 text-sm text-zinc-500">pagamento único • acesso imediato</div>
            <BuyForm productSlug={product.slug} priceLabel={price} />
          </div>
        </aside>
      </main>
      <SiteFooter />
      <WhatsAppFloat message={`Olá Felipe! Tenho uma dúvida sobre a planilha "${product.title}".`} />
      <MobileCtaBar href="#comprar" label={`Comprar por ${price}`} note={`Acesso imediato • Garantia de ${site.guaranteeDays} dias`} />
    </div>
  );
}
