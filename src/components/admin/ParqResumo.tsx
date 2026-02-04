export default function ParqResumo({ data }: { data: any }) {
  const d = data || {};

  const yesNo = (v: any) => (v === true ? "Sim" : v === false ? "Não" : "—");

  const rows: Array<[string, string]> = [
    ["Tem dor no peito durante atividade física?", yesNo(d.chestPainActivity)],
    ["Teve dor no peito no último mês (em repouso)?", yesNo(d.chestPainRest)],
    ["Já desmaiou ou sentiu tontura forte?", yesNo(d.faintOrDizzy)],
    ["Tem problema ósseo/articular que piora com exercício?", yesNo(d.boneJointProblem)],
    ["Usa remédio para pressão ou coração?", yesNo(d.bloodPressureMeds)],
    ["O médico já disse que você tem problema cardíaco?", yesNo(d.heartCondition)],
    ["Alguma outra razão para não fazer exercício sem orientação médica?", yesNo(d.otherReason)],
  ];

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Questionário PAR-Q (saúde e segurança)
        </div>
        <p className="mt-1 text-sm text-zinc-600">
          Resumo do aluno. Se houver “Sim” em itens críticos, reforce orientação médica e adapte intensidade.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 overflow-hidden">
        <div className="bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Respostas
        </div>

        <div className="divide-y divide-zinc-200">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-4 px-4 py-3">
              <div className="text-sm text-zinc-700">{label}</div>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                  value === "Sim"
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : value === "Não"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700"
                }`}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {d.notes && (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Observações do aluno
          </div>
          <div className="mt-2 text-sm text-zinc-700">{String(d.notes)}</div>
        </div>
      )}
    </div>
  );
}
