import { pdf, Document, Page, Text, View } from "@react-pdf/renderer";

export async function renderWorkoutPdfBuffer(workout: any, student: { fullName: string }) {
  const Doc = (
    <Document>
      <Page size="A4" style={{ padding: 28, fontSize: 11 }}>
        <Text style={{ fontSize: 16, marginBottom: 6 }}>{workout.title}</Text>
        <Text style={{ marginBottom: 10 }}>Aluno(a): {student.fullName}</Text>

        <Text style={{ fontSize: 12, marginBottom: 6 }}>Resumo</Text>
        <Text style={{ marginBottom: 10 }}>{workout.profileSummary}</Text>

        <Text style={{ fontSize: 12, marginBottom: 6 }}>Observações de segurança</Text>
        {workout.safetyNotes?.map((s: string, i: number) => (
          <Text key={i}>• {s}</Text>
        ))}

        <View style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 12, marginBottom: 6 }}>Aquecimento</Text>
          {workout.warmup?.map((w: any, i: number) => (
            <Text key={i}>
              • {w.name} — {w.durationMin} min — {w.notes}
            </Text>
          ))}
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 12, marginBottom: 6 }}>Treinos</Text>
          {workout.workouts?.map((wk: any, i: number) => (
            <View key={i} style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 12 }}>{wk.name} — {wk.focus}</Text>
              {wk.exercises?.map((ex: any, j: number) => (
                <Text key={j}>
                  - {ex.exercise} | {ex.sets} x {ex.reps} | descanso {ex.restSec}s | tempo {ex.tempo}
                </Text>
              ))}
              <Text>Final: {wk.finisher}</Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 12, marginBottom: 6 }}>Progressão</Text>
          <Text>Semana 1: {workout.progression.week1}</Text>
          <Text>Semana 2: {workout.progression.week2}</Text>
          <Text>Semana 3: {workout.progression.week3}</Text>
          <Text>Deload/Teste: {workout.progression.deloadOrTest}</Text>
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 12, marginBottom: 6 }}>Hábitos</Text>
          {workout.habits?.map((h: string, i: number) => (
            <Text key={i}>• {h}</Text>
          ))}
        </View>
      </Page>
    </Document>
  );

  const out = await pdf(Doc).toBuffer();
  return out;
}
