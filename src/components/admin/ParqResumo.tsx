type ParqData = {
  notes?: string;
  chestPain?: boolean;
  dizziness?: boolean;
  medication?: boolean;
  otherReason?: boolean;
  jointProblem?: boolean;
};

function Badge({ yes }: { yes: boolean }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        yes
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700",
      ].join(" ")}
    >
      {yes ? "Sim" : "Não"}
    </span>
  );
}

function Row({
  title,
  value,
}: {
  title: string;
  value?: boolean;
}) {
  const yes = value === true;

  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-zinc-200 bg-white px-4 py-3">
      <div className="text-sm font-medium text-zinc-800">{title}</div>
      <Badge yes={yes} />
    </div>
  );
}

export default function ParqResumo({ data }: { data: ParqData }) {
  const notes = (data?.notes ?? "").trim();

  const anyYes =
    !!data?.chestPain ||
    !!data?.dizziness ||
    !!data?.medication ||
    !!data?.jointProblem ||
    !!data?.otherReason;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            PAR-Q / Triagem de saúde
          </div>
          <div className="mt-1 text-sm text-zinc-600">
            Respostas do aluno para segurança antes do treino.
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Row
          title="Teve dor ou desconforto no peito ao fazer atividade física?"
          value={data?.chestPain}
        />
        <Row
          title="Já sentiu tontura, desmaio ou falta de equilíbrio durante esforço?"
          value={data?.dizziness}
        />
        <Row
          title="Usa algum medicamento contínuo que possa interferir no treino?"
          value={data?.medication}
        />
        <Row
          title="Possui dor/lesão articular ou limitação que atrapalhe exercícios?"
          value={data?.jointProblem}
        />
        <Row
          title="Existe algum outro motivo de saúde para evitar ou adaptar o treino?"
          value={data?.otherReason}
        />
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Observações do aluno
        </div>
        <div className="mt-2 text-sm text-zinc-700">
          {notes.length > 0 ? notes : "Nenhuma observação informada."}
        </div>
      </div>

      {anyYes && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <b>Atenção:</b> há respostas marcadas como <b>“Sim”</b>. Considere
          solicitar liberação/avaliação médica ou adaptar o plano com mais cautela.
        </div>
      )}
    </div>
  );
}
