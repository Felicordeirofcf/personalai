import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { refreshPurchaseStatus } from "@/lib/purchases";
import { SiteHeader } from "@/components/site/SiteHeader";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { AutoRefresh } from "@/components/site/AutoRefresh";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Acesso à sua planilha | ${site.name}`,
  robots: { index: false, follow: false },
};

export default async function AccessPage(props: {
  params: Promise<{ purchaseId: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { purchaseId } = await props.params;
  const { t = "" } = await props.searchParams;

  const found = await prisma.productPurchase.findUnique({ where: { id: purchaseId }, include: { product: true } });
  if (!found || found.accessToken !== t) notFound();

  const purchase = await refreshPurchaseStatus(purchaseId);
  const paid = purchase?.status === "paid";
  const firstName = found.fullName.split(" ")[0];
  const downloadUrl = `/api/planilhas/download/${found.id}?t=${encodeURIComponent(t)}`;

  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto max-w-xl px-4 py-14 text-center">
        {paid ? (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl">✓</div>
            <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Tudo certo, {firstName}!</h1>
            <p className="mt-3 text-zinc-600">
              Sua planilha <strong>{found.product.title}</strong> está liberada.
            </p>
            <a
              href={downloadUrl}
              className="mt-8 inline-block w-full rounded-xl bg-emerald-600 px-6 py-4 text-lg font-bold text-white shadow-lg hover:bg-emerald-700"
            >
              Baixar minha planilha (PDF)
            </a>
            <p className="mt-4 text-sm text-zinc-500">
              Salve esta página nos favoritos — o link também foi enviado para o seu WhatsApp.
            </p>
            <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 text-left text-sm text-zinc-600">
              <div className="font-bold text-zinc-900">Quer um treino feito só para você?</div>
              <p className="mt-1">
                No treino personalizado eu monto tudo a partir da sua avaliação, rotina e limitações.
              </p>
              <a href="/personalizado" className="mt-3 inline-block font-semibold text-emerald-700 underline">
                Conhecer o treino personalizado →
              </a>
            </div>
          </>
        ) : (
          <>
            <AutoRefresh seconds={8} />
            <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-zinc-200 border-t-emerald-600" />
            <h1 className="mt-6 text-2xl font-extrabold tracking-tight">Aguardando confirmação do pagamento…</h1>
            <p className="mt-3 text-zinc-600">
              Pix costuma confirmar em segundos. Esta página atualiza sozinha e o download aparece aqui assim que o
              pagamento for aprovado.
            </p>
            {found.paymentUrl ? (
              <a
                href={found.paymentUrl}
                className="mt-8 inline-block rounded-xl border border-zinc-300 bg-white px-6 py-3 font-semibold hover:bg-zinc-100"
              >
                Ainda não pagou? Abrir pagamento
              </a>
            ) : null}
          </>
        )}
      </main>
      <WhatsAppFloat message="Olá Felipe! Comprei uma planilha e preciso de ajuda com o acesso." />
    </div>
  );
}
