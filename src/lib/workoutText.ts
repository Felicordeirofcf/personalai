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

  const overview = w.overview ?? {};
  const plan = Array.isArray(w.plan) ? w.plan : [];

  let text =
    `Olá, ${name}! ✅\n\n` +
    `Aqui está seu treino personalizado.\n\n` +
    `🎯 Objetivo: ${line(overview.goal || goal)}\n` +
    `📅 Frequência: ${line(overview.frequencyPerWeek || freq)}\n` +
    `⏱️ Tempo por dia: ${line(overview.timePerDayMin || timeMin)} min\n` +
    (line(overview.equipment || order.equipment) ? `🏋️ Equipamentos: ${line(overview.equipment || order.equipment)}\n` : "") +
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
        const sets = ex.sets ?? "";
        const reps = line(ex.reps);
        const rest = ex.restSec ?? "";
        const notes = line(ex.notes);

        text += `  - ${line(ex.name)}: ${sets}x ${reps} (descanso ${rest}s)${notes ? ` — ${notes}` : ""}\n`;
      }
    }

    if (Array.isArray(day.cooldown) && day.cooldown.length) {
      text += `• Finalização:\n`;
      for (const i of day.cooldown) text += `  - ${line(i)}\n`;
    }

    if (line(day.intensity)) {
      text += `• Intensidade: ${line(day.intensity)}\n`;
    }

    text += `\n`;
  }

  if (Array.isArray(w.progression) && w.progression.length) {
    text += `📈 Progressão:\n`;
    for (const p of w.progression) text += `- ${line(p)}\n`;
    text += `\n`;
  }

  if (Array.isArray(w.extraNotes) && w.extraNotes.length) {
    text += `📝 Observações:\n`;
    for (const n of w.extraNotes) text += `- ${line(n)}\n`;
    text += `\n`;
  }

  text += `Qualquer dor fora do normal: pare e me avise. 💪`;

  if (text.length > 12000) {
    text = text.slice(0, 11800) + "\n\n(…mensagem resumida. Se quiser, envio em partes.)";
  }

  return text;
}
