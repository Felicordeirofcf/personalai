/* eslint-disable jsx-a11y/alt-text */
import path from "node:path";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { site } from "@/lib/site";

const NAVY = "#1B3B5A";

const styles = StyleSheet.create({
  page: { padding: 30, paddingBottom: 60, fontFamily: "Helvetica", fontSize: 10, color: "#222" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: NAVY,
    paddingBottom: 10,
  },
  logo: { width: 56, height: 56, marginRight: 14, borderRadius: 28 },
  brand: { fontSize: 18, fontFamily: "Helvetica-Bold", color: NAVY },
  muted: { fontSize: 9, color: "#666", marginTop: 2 },
  title: { fontSize: 16, fontFamily: "Helvetica-Bold", color: NAVY, marginBottom: 4 },
  subtitle: { fontSize: 10, color: "#555", marginBottom: 12 },
  owner: { backgroundColor: "#F3F5F8", padding: 8, borderRadius: 4, marginBottom: 14, fontSize: 9 },
  body: { fontSize: 10, lineHeight: 1.5 },
  footer: {
    position: "absolute",
    bottom: 22,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#888",
  },
});

type Props = {
  title: string;
  subtitle?: string;
  content: string;
  buyerName: string;
  buyerEmail: string;
};

export function ProductPdf({ title, subtitle, content, buyerName, buyerEmail }: Props) {
  const logoPath = path.join(process.cwd(), "public", "logo.png");

  return (
    <Document title={title} author={site.name}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image style={styles.logo} src={logoPath} />
          <View>
            <Text style={styles.brand}>{site.name}</Text>
            <Text style={styles.muted}>CONSULTORIA DE TREINO ONLINE • {site.cref}</Text>
          </View>
        </View>

        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

        <Text style={styles.owner}>
          Licenciado para: {buyerName} ({buyerEmail}) — uso pessoal e intransferível.
        </Text>

        <Text style={styles.body}>{content || "Conteúdo em preparação."}</Text>

        <View style={styles.footer} fixed>
          <Text>
            {site.name} © {new Date().getFullYear()} • {site.domain}
          </Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
