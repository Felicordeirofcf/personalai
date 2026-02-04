import { prisma } from "@/lib/db";
import { getPaymentInstructions } from "@/lib/pix";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function CheckoutPage({ params }: { params: { orderId: string } }) {
  const order = await prisma.order.findUnique({ where: { id: params.orderId } });
  if (!order) return <div className="p-8">Pedido não encontrado.</div>;

  const pay = getPaymentInstructions(order.id, order.priceCents);
  const status = order.status;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xl font-extrabold">Pagamento</div>
            <Badge>{pay.methodLabel}</Badge>
          </div>
          <div className="text-sm text-zinc-600">
            Pedido: <strong>#{pay.reference}</strong> • Status: <strong>{status}</strong>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-sm font-extrabold">Como pagar</div>
            <div className="mt-2 text-sm text-zinc-700 whitespace-pre-wrap">
              {pay.instructions}
            </div>

            <Separator />

            <div className="grid gap-2 text-sm">
              <div><strong>Recebedor:</strong> {pay.receiverName}</div>
              <div><strong>Chave Pix:</strong> {pay.pixKey}</div>
              <div><strong>Valor:</strong> R$ {pay.amountBRL}</div>
              <div><strong>Identificação:</strong> {pay.reference}</div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <div className="text-sm font-extrabold">Enviar comprovante</div>
            <div className="text-sm text-zinc-600">
              Faça upload do comprovante. Eu vou confirmar manualmente e liberar o treino.
            </div>

            <form
              className="mt-3 space-y-3"
              action={`/api/public/orders/${order.id}/receipt`}
              method="POST"
              encType="multipart/form-data"
            >
              <input type="file" name="receipt" accept="image/*,application/pdf" required />
              <input type="text" name="paymentNote" className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm"
                placeholder="Observação (opcional): ex.: pago do Nubank, horário, etc."
              />
              <button className="h-11 w-full rounded-xl bg-black text-white text-sm font-semibold">
                Enviar comprovante
              </button>
            </form>
          </div>

          <div className="text-sm text-zinc-600">
            Você pode acompanhar aqui:{" "}
            <a className="underline" href={`/status/${order.id}`}>/status/{order.id}</a>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
