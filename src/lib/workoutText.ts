function line(v: any) {
  return String(v ?? "").trim();
}

export function workoutToWhatsAppText(order: any) {
  const w = order.finalWorkoutJson ?? order.aiDraftJson;

  const name = line(order.fullName) || "Aluno(a)";
  const goal = line(order.goal);
  const freq = line(order.frequency);
  const timeMin = order.timePerDayMin ? String(order.timePerDayMin) : "";
  const time = timeMin ? `${timeMin} min/dia` : "";

  if (!w) {
    return (
      `Olá, ${name}! ✅\n\n` +
      `Recebi seu pedido e estou finalizando seu treino.\n` +
      `Assim que estiver pronto, te envio por aqui.\n\n` +
      `Resumo: ${goal} • ${freq} • ${time}`.trim()
    );
  }

  const ov = w.overview ?? {};
  const plan = Array.isArray(w.plan) ? w.plan : [];

  let text =
    `Olá, ${name}! ✅\n\n` +
    `Aqui está seu treino personalizado.\n\n` +
    `🎯 Objetivo: ${line(ov.goal || goal)}\n` +
    `📅 Frequência: ${line(ov.frequencyPerWeek || freq)}\n` +
    `⏱️ Tempo por dia: ${line(ov.timePerDayMin || timeMin)} min\n` +
    (line(ov.equipment || order.equipment) ? `🏋️ Equipamentos: ${line(ov.equipment || order.equipment)}\n` : "") +
    `\n`;

  for (const day of plan) {
    text += `🏋️ ${line(day.day)} — ${line(day.focus)} (${day.durationMin ?? ""} min)\n`;

    if (Array.isArray(day.warmup) && day.warmup.length) {
      text += `• Aquecimento:\n`;
      for (const i of day.warmup) text += `  - ${line(i)}\n`;
    }

    if (Array.isArray(day.workout) && day.workout.length) {
      text += `• Treino:\n`;
      for (const ex of day.workout) {
        text += `  - ${line(ex.name)}: ${ex.sets ?? ""}x ${line(ex.reps)} (descanso ${ex.restSec ?? ""}s)`;
        const n = line(ex.notes);
        text += n ? ` — ${n}\n` : "\n";
      }
    }

    if (Array.isArray(day.cooldown) && day.cooldown.length) {
      text += `• Finalização:\n`;
      for (const i of day.cooldown) text += `  - ${line(i)}\n`;
    }

    if (line(day.intensity)) text += `• Intensidade: ${line(day.intensity)}\n`;
    text += `\n`;
  }

  text += `Se quiser, me diga como se sentiu no 1º dia que eu ajusto. 💪`;

  return text;
}
