import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt={site.name} width={36} height={36} className="rounded-full" />
          <div className="leading-tight">
            <div className="text-sm font-extrabold tracking-tight text-zinc-900">{site.name}</div>
            <div className="text-[11px] text-zinc-500">{site.cref}</div>
          </div>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/planilhas" className="hidden rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100 sm:block">
            Planilhas
          </Link>
          <Link href="/personalizado" className="hidden rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100 sm:block">
            Personalizado
          </Link>
          <Link href="/#faq" className="hidden rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100 md:block">
            Dúvidas
          </Link>
          <Link
            href="/#planos"
            className="rounded-xl bg-zinc-900 px-4 py-2 font-semibold text-white hover:bg-zinc-800"
          >
            Ver planos
          </Link>
        </nav>
      </div>
    </header>
  );
}
