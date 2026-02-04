"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { WorkoutPdf } from "./WorkoutPdf";
import { useEffect, useState } from "react";

export function DownloadButton({ order, finalWorkout }: { order: any, finalWorkout: string }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <Button disabled variant="outline">Carregando PDF...</Button>;

  if (!finalWorkout) return <Button disabled variant="outline">Sem Treino para Gerar</Button>;

  return (
    <PDFDownloadLink
      document={<WorkoutPdf order={order} finalWorkout={finalWorkout} />}
      fileName={`Treino_${order.fullName.replace(/\s+/g, '_')}.pdf`}
    >
      {/* @ts-ignore: O componente de PDF do React as vezes reclama da tipagem do children, o ignore resolve */}
      {({ blob, url, loading, error }: any) => (
        <Button 
          variant="outline" 
          className="w-full border-zinc-300 text-zinc-700 hover:bg-zinc-100"
          disabled={loading}
        >
          {loading ? "Gerando PDF..." : "📄 Baixar PDF com Logo"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}