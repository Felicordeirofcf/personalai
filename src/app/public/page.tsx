import ParqWizard from "@/components/public/ParqWizard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 grid gap-6 md:grid-cols-2 md:items-center">
        <div className="space-y-3">
          <Badge>Treino + Acompanhamento</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Consultoria de Treino Online com revisão profissional
          </h1>
          <p className="text-zinc-600">
           Você preenche sua avaliação completa e realiza o pagamento. Em seguida, eu analiso seu perfil e monto um planejamento de treino estratégico e exclusivo para seus objetivos.
          </p>

          <div className="grid gap-3 md:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-extrabold">1) Avaliação</div>
                <div className="text-sm text-zinc-600">Dados + PAR-Q básico</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-extrabold">2) Pagamento</div>
                <div className="text-sm text-zinc-600">Pix/transferência</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-extrabold">3) Entrega</div>
                <div className="text-sm text-zinc-600">PDF + Acompanhamento</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <ParqWizard />
      </div>

      <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
        <strong className="text-zinc-900">Aviso:</strong> Treinamento físico não substitui orientação médica. Em casos de dor, lesão ou condições clínicas, pode ser necessária liberação.
      </div>
    </main>
  );
}
