import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.title} — Planilhas e treino personalizado online`,
  description:
    "Planilhas de treino prontas com entrega imediata e treino 100% personalizado, montados por personal trainer " +
    `${site.cref}. Pague com Pix ou cartão e comece hoje.`,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    title: `${site.title} — Treinos online`,
    description: "Planilhas prontas e treino personalizado montados por personal trainer.",
    images: ["/logo.png"],
  },
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="min-h-screen bg-zinc-50 text-zinc-900">{children}</body>
    </html>
  );
}
