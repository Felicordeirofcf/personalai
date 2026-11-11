import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-zinc-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm text-zinc-600 sm:grid-cols-3">
        <div>
          <div className="font-extrabold text-zinc-900">{site.name}</div>
          <div>Personal Trainer • {site.cref}</div>
        </div>
        <div className="space-y-1">
          <Link href="/planilhas" className="block hover:text-zinc-900">Planilhas prontas</Link>
          <Link href="/personalizado" className="block hover:text-zinc-900">Treino personalizado</Link>
          <a href={whatsappLink("Olá Felipe! Tenho uma dúvida sobre os treinos.")} className="block hover:text-zinc-900">
            WhatsApp
          </a>
          {site.instagram ? <a href={site.instagram} className="block hover:text-zinc-900">Instagram</a> : null}
        </div>
        <div className="text-xs leading-relaxed">
          Treinamento físico não substitui orientação médica. Em casos de dor, lesão ou condições clínicas, pode ser
          necessária liberação profissional.
          <div className="mt-2">© {new Date().getFullYear()} {site.name}</div>
        </div>
      </div>
    </footer>
  );
}
