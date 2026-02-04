/* eslint-disable jsx-a11y/alt-text */
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";

// Registrando fonte (opcional)
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v1/1.ttf' },
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v1/1.ttf', fontWeight: 'bold' },
  ]
});

const styles = StyleSheet.create({
  page: { flexDirection: "column", backgroundColor: "#FFFFFF", padding: 30, fontFamily: "Helvetica" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20, borderBottomWidth: 2, borderBottomColor: "#1B3B5A", paddingBottom: 10 },
  logo: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  headerText: { flexDirection: "column" },
  title: { fontSize: 18, fontWeight: "bold", color: "#1B3B5A", textTransform: "uppercase" },
  subtitle: { fontSize: 10, color: "#CA5F34", marginTop: 2, fontWeight: "bold", letterSpacing: 1 },
  cref: { fontSize: 9, color: "#666", marginTop: 2 },
  studentBox: { backgroundColor: "#F5F8FA", padding: 10, borderRadius: 5, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: "#CA5F34" },
  studentRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  studentLabel: { fontSize: 10, color: "#666", fontWeight: "bold" },
  studentValue: { fontSize: 10, color: "#333" },
  workoutTitle: { fontSize: 14, fontWeight: "bold", color: "#1B3B5A", marginBottom: 10, marginTop: 10, backgroundColor: "#Eef2f6", padding: 5 },
  workoutText: { fontSize: 11, lineHeight: 1.5, color: "#333", textAlign: "justify" },
  footer: { position: "absolute", bottom: 30, left: 30, right: 30, textAlign: "center", borderTopWidth: 1, borderTopColor: "#EEE", paddingTop: 10 },
  footerText: { fontSize: 8, color: "#999" },
});

interface WorkoutPdfProps {
  order: any;
  finalWorkout: string;
}

export const WorkoutPdf = ({ order, finalWorkout }: WorkoutPdfProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        {/* IMPORTANTE: No servidor, as vezes ele não acha a imagem pelo caminho relativo.
            Se a imagem quebrar o PDF, remova a linha <Image ... /> temporariamente para testar. */}
        {/* <Image style={styles.logo} src="/logo.png" /> */}
        <View style={styles.headerText}>
          <Text style={styles.title}>Felipe Ferreira</Text>
          <Text style={styles.subtitle}>CONSULTORIA DE TREINO ONLINE</Text>
          <Text style={styles.cref}>CREF 071550-RJ</Text>
        </View>
      </View>

      <View style={styles.studentBox}>
        <View style={styles.studentRow}>
          <Text style={styles.studentLabel}>ALUNO(A):</Text>
          <Text style={styles.studentValue}>{order.fullName?.toUpperCase()}</Text>
        </View>
        <View style={styles.studentRow}>
          <Text style={styles.studentLabel}>OBJETIVO:</Text>
          <Text style={styles.studentValue}>{order.goal}</Text>
        </View>
        <View style={styles.studentRow}>
          <Text style={styles.studentLabel}>DATA:</Text>
          <Text style={styles.studentValue}>{new Date().toLocaleDateString('pt-BR')}</Text>
        </View>
      </View>

      <Text style={styles.workoutTitle}>PLANEJAMENTO DE TREINO</Text>

      <View>
        <Text style={styles.workoutText}>
          {finalWorkout || "Nenhum treino definido."}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Documento pessoal e intransferível. Foco e bom treino!
        </Text>
        <Text style={{ ...styles.footerText, marginTop: 4, fontWeight: 'bold', color: '#1B3B5A' }}>
          Felipe Ferreira Personal Trainer © {new Date().getFullYear()}
        </Text>
      </View>
    </Page>
  </Document>
);