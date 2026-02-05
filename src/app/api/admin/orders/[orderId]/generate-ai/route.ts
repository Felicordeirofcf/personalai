import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  req: Request,
  props: { params: Promise<{ orderId: string }> }
) {
  try {
    const params = await props.params;
    
    // Busca o pedido no banco
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    const parq = (order.parqJson as any) || {};
    
    // Tratamento dos alertas de saúde (PAR-Q)
    let parqAlerts = "";
    if (parq.chestPain) parqAlerts += "- ALERTA CRÍTICO: Sente dores no peito (Evitar alta intensidade)\n";
    if (parq.dizziness) parqAlerts += "- ALERTA: Histórico de tonturas/desmaios (Cuidado com mudanças bruscas de nível)\n";
    if (parq.jointProblem) parqAlerts += "- ALERTA: Problema ósseo/articular (Evitar impacto, priorizar máquinas)\n";
    if (parq.medication) parqAlerts += "- ALERTA: Usa medicação contínua (Monitorar esforço)\n";
    
    // --- PROMPT INTELIGENTE (Deduz Sexo pelo Nome + Regras de PDF) ---
    const promptSistema = `
      Você é o Felipe Ferreira, um Personal Trainer experiente e técnico (CREF 071550-RJ).
      Seu objetivo é montar um treino de musculação EXCELENTE e SEGURO.
      
      --- DADOS DO ALUNO ---
      Nome: ${order.fullName}
      Objetivo: ${order.goal}
      Experiência: ${order.experience}
      Local: ${order.location} (Priorize máquinas se for academia)
      Frequência Semanal: ${order.frequency}
      Tempo disponível: ${order.timePerDayMin} min
      Limitações: ${order.limitations || "Nenhuma"}
      
      --- ANÁLISE DE SAÚDE (PAR-Q) ---
      ${parqAlerts || "Nenhuma restrição grave reportada."}
      ${parq.notes ? `Obs do aluno: ${parq.notes}` : ""}

      --- REGRAS DE PERSONALIZAÇÃO ---
      
      1. IDENTIFICAÇÃO DE GÊNERO PELO NOME:
         - Analise o nome "${order.fullName}".
         - Se provável FEMININO: Dê ênfase natural em membros inferiores e glúteos (salvo se o objetivo for explicitamente "Braços" ou "Costas").
         - Se provável MASCULINO: Distribuição equilibrada ou ênfase em tronco/braços conforme objetivo padrão de hipertrofia masculina.
      
      2. DEFINIÇÃO DA DIVISÃO (Baseada na frequência):
         - 1-2 dias: Full Body.
         - 3 dias: Full Body ou ABC (1x).
         - 4 dias: AB Upper/Lower (2x) ou ABCD (Sequencial).
         - 5-6 dias: ABC (2x), ABCD (Rotativo).
      
      3. REGRAS DE FORMATAÇÃO (RIGOROSO PARA GERAR PDF):
         - NÃO faça introduções longas. Comece direto: "Olá ${order.fullName.split(' ')[0]}, aqui está seu treino..."
         - Use lista numerada para os exercícios (1., 2., 3...).
         - Na MESMA LINHA do nome do exercício, coloque SÉRIES e REPETIÇÕES (Ex: "1. Agachamento Livre - 4x10").
         - Observações técnicas (cadência, drop-set, descanso) devem vir na linha DEBAIXO do exercício.
         - Aquecimento: Apenas 1 ou 2 itens breves no início.
         - Aeróbico: Apenas no FINAL (tempo e intensidade).

      --- EXEMPLO DE SAÍDA DESEJADA ---
      
      Olá Ana, montei uma divisão AB Upper/Lower com foco em Glúteos para você.
      
      ### Treino A - Inferiores (Foco em Glúteos)
      1. Elevação Pélvica - 4 séries de 10 a 12 reps
      Segurar 2 segundos no topo de cada repetição.
      2. Agachamento Sumô - 4x12
      ...
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: promptSistema },
        { role: "user", content: "Analise o nome e monte o treino seguindo as regras." },
      ],
      temperature: 0.7,
    });

    const treinoGerado = completion.choices[0].message.content || "";

    await prisma.order.update({
      where: { id: params.orderId },
      data: {
        aiDraftJson: treinoGerado, 
        finalWorkoutJson: order.finalWorkoutJson ? undefined : treinoGerado,
      },
    });

    return NextResponse.json({ ok: true, text: treinoGerado });
  } catch (error) {
    console.error("Erro na IA:", error);
    return NextResponse.json({ error: "Erro ao gerar treino" }, { status: 500 });
  }
}