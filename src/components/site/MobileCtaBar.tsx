import Link from "next/link";

// Barra fixa de compra no celular — o botão de ação sempre visível.
export function MobileCtaBar({ label, href, note }: { label: string; href: string; note?: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
      <Link
        href={href}
        className="block rounded-xl bg-emerald-600 py-3.5 text-center text-base font-bold text-white shadow-lg active:scale-[0.99]"
      >
        {label}
      </Link>
      {note ? <div className="mt-1 text-center text-[11px] text-zinc-500">{note}</div> : null}
    </div>
  );
}
