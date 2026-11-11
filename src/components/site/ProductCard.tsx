import Link from "next/link";
import { formatBRL } from "@/lib/utils";
import type { ProductCardData } from "@/lib/products";

export function ProductCard({ product }: { product: ProductCardData }) {
  const tags = [product.level, product.location, product.durationWeeks ? `${product.durationWeeks} semanas` : ""].filter(
    Boolean,
  );

  return (
    <Link
      href={`/planilhas/${product.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="mb-3 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span key={t} className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
            {t}
          </span>
        ))}
      </div>
      <h3 className="text-lg font-extrabold tracking-tight text-zinc-900">{product.title}</h3>
      {product.subtitle ? <p className="mt-1 text-sm text-zinc-600">{product.subtitle}</p> : null}

      {product.highlights.length > 0 ? (
        <ul className="mt-4 space-y-1.5 text-sm text-zinc-700">
          {product.highlights.slice(0, 4).map((h) => (
            <li key={h} className="flex gap-2">
              <span className="text-emerald-600">✓</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-auto flex items-end justify-between gap-2 pt-6">
        <div>
          {product.compareAtCents && product.compareAtCents > product.priceCents ? (
            <div className="text-xs text-zinc-400 line-through">{formatBRL(product.compareAtCents)}</div>
          ) : null}
          <div className="text-2xl font-extrabold text-zinc-900">{formatBRL(product.priceCents)}</div>
        </div>
        <span className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white group-hover:bg-zinc-800">
          Ver planilha
        </span>
      </div>
    </Link>
  );
}
