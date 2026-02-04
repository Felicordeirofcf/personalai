import "server-only";

/**
 * Renderiza o PDF em buffer sem quebrar o build do Next/Render.
 * - Usa import dinâmico do @react-pdf/renderer
 * - Se a lib não estiver instalada, joga erro amigável
 */
export async function renderWorkoutPdfBuffer(
  workout: any,
  student: { fullName: string }
) {
  let renderer: any;
  try {
    renderer = await import("@react-pdf/renderer");
  } catch {
    throw new Error(
      "PDF desativado: instale `@react-pdf/renderer` para gerar PDF. Rode: npm i @react-pdf/renderer"
    );
  }

  const { pdf, Document, Page, Text, View } = renderer;

  const safeArr = (v: any) => (Array.isArray(v) ? v : []);
  const safeStr = (v: any) => (v == null ? "" : String(v));

  const Doc = (
    <Document>
      <Page size="A4" style={{ padding: 28, fontSize: 11 }}>
        <Text style={{ fontSize: 16, marginBottom: 6 }}>
          {safeStr(workout?.title) || "Treino Personalizado"}
        </Text>

        <Text style={{ marginBottom: 10 }}>
          Aluno(a): {safeStr(student?.fullName)}
        </Text>

        <Text style={{ fontSize: 12, marginBottom: 6 }}>Resumo</Text>
        <Text style={{ marginBottom: 10 }}>
          {safeStr(workout?.profileSummary)}
        </Text>

        <Text style={{ fontSize: 12, marginBottom: 6 }}>
          Observações de segurança
        </Text>
        {safeArr(workout?.safetyNotes).map((s: string, i: number) => (
          <Text key={i}>• {safeStr(s)}</Text>
        ))}

        <View style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 12, marginBottom: 6 }}>Aquecimento</Text>
          {safeArr(workout?.warmup).map((w: any, i: number) => (
            <Text key={i}>
              • {safeStr(w?.name)} — {safeStr(w?.durationMin)} min —{" "}
              {safeStr(w?.notes)}
            </Text>
          ))}
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 12, marginBottom: 6 }}>Treinos</Text>
          {safeArr(workout?.workouts).map((wk: any, i: number) => (
            <View key={i} style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 12 }}>
                {safeStr(wk?.name)} — {safeStr(wk?.focus)}
              </Text>

              {safeArr(wk?.exercises).map((ex: any, j: number) => (
                <Text key={j}>
                  - {safeStr(ex?.exercise)} | {safeStr(ex?.sets)} x{" "}
                  {safeStr(ex?.reps)} | descanso {safeStr(ex?.restSec)}s | tempo{" "}
                  {safeStr(ex?.tempo)}
                </Text>
              ))}

              <Text>Final: {safeStr(wk?.finisher)}</Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 12, marginBottom: 6 }}>Progressão</Text>
          <Text>Semana 1: {safeStr(workout?.progression?.week1)}</Text>
          <Text>Semana 2: {safeStr(workout?.progression?.week2)}</Text>
          <Text>Semana 3: {safeStr(workout?.progression?.week3)}</Text>
          <Text>
            Deload/Teste: {safeStr(workout?.progression?.deloadOrTest)}
          </Text>
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 12, marginBottom: 6 }}>Hábitos</Text>
          {safeArr(workout?.habits).map((h: string, i: number) => (
            <Text key={i}>• {safeStr(h)}</Text>
          ))}
        </View>
      </Page>
    </Document>
  );

  // ✅ Buffer para usar em upload ou envio
  const out = await pdf(Doc).toBuffer();
  return out as Buffer;
}
