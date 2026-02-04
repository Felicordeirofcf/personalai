import Link from "next/link";

function NavItem({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
    >
      {label}
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          <aside className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="mb-4">
              <div className="text-xs font-semibold text-zinc-500">PAINEL</div>
              <div className="text-lg font-extrabold tracking-tight">Admin</div>
              <div className="mt-1 text-xs text-zinc-500">
                pedidos • pagamentos • entrega
              </div>
            </div>

            <div className="space-y-1">
              <NavItem href="/admin" label="Pedidos" />
              <NavItem href="/" label="Landing" />
            </div>

            <div className="mt-6 rounded-xl bg-zinc-50 p-3 text-xs text-zinc-600">
              Dica: confirme pagamento, gere rascunho com IA, revise e envie.
            </div>
          </aside>

          <main className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
