import "./globals.css";

export const metadata = {
  title: "Consultoria de Treino Online",
  description: "Treino personalizado com revisão profissional + envio após confirmação.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="min-h-screen bg-zinc-50 text-zinc-900">
        {children}
      </body>
    </html>
  );
}
