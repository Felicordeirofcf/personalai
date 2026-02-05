import ParqWizard from "@/components/public/ParqWizard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 grid gap-12 lg:grid-cols-2 lg:items-start">
        <div className="space-y-8">
          <div>
            <Badge className="bg-zinc-100 text-zinc-800 border-zinc-200 mb-4">
              🚀 Treino + Ciência + Tecnologia
            </Badge>

            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl leading-tight">
              Treine com a Metodologia de um Personal de Elite, onde e quando quiser.
            </h1>

            <p className="mt-6 text-lg text-zinc-600 leading-relaxed">
              Esqueça as fichas genéricas de academia. Receba um planejamento estratégico, 
              baseado em biomecânica e adaptado à sua rotina, nível e objetivos. 
              Saia da estagnação e tenha resultados reais com acompanhamento profissional.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-zinc-200 shadow-sm bg-zinc-50/50">
              <CardContent className="p-4">
                <div className="text-sm font-extrabold text-zinc-900 mb-1">1) Anamnese</div>
                <div className="text-xs text-zinc-600 leading-snug">Análise profunda do seu perfil e histórico.</div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200 shadow-sm bg-zinc-50/50">
              <CardContent className="p-4">
                <div className="text-sm font-extrabold text-zinc-900 mb-1">2) Inscrição</div>
                <div className="text-xs text-zinc-600 leading-snug">Pagamento seguro via Pix.</div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200 shadow-sm bg-zinc-50/50">
              <CardContent className="p-4">
                <div className="text-sm font-extrabold text-zinc-900 mb-1">3) Início Imediato</div>
                <div className="text-xs text-zinc-600 leading-snug">Receba seu protocolo em PDF no WhatsApp.</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:sticky lg:top-10">
          <ParqWizard />
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 shadow-sm">
        <strong className="text-zinc-900">Aviso:</strong> Treinamento físico não substitui orientação médica. 
        Em casos de dor, lesão ou condições clínicas, pode ser necessária liberação profissional.
      </div>
    </main>
  );
}