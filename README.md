# 🏋️ Treino AI - Plataforma de Consultoria Online

Sistema completo para automação de consultoria de personal trainer. A aplicação gerencia desde a captação do aluno (anamnese), processamento do pagamento (Asaas), até a geração automática de treinos personalizados via Inteligência Artificial e entrega em PDF.

## 🚀 Funcionalidades

### 👤 Área do Aluno (Pública)
- **Anamnese Completa:** Formulário detalhado para coleta de dados (objetivo, experiência, local de treino).
- **PAR-Q Digital:** Questionário de prontidão para atividade física com alertas de saúde.
- **Checkout Transparente:** Integração direta com API do **Asaas** (Pix).
- **Validação de CPF:** Verificação de dados para emissão de nota/pagamento.
- **Página de Obrigado:** Redirecionamento automático após pagamento confirmado com instruções e suporte via WhatsApp.

### 🔐 Painel Administrativo (Personal Trainer)
- **Dashboard Protegido:** Login seguro para acesso aos dados.
- **Gestão de Pedidos:**
  - Listagem de todos os alunos.
  - **Filtros Avançados:** Busca por nome, email ou ID e filtro por status (Pendente, Pago, Enviado).
  - **Ações:** Visualizar detalhes, Excluir pedidos e Aprovação manual de pagamento.
- **Geração de Treino com IA:**
  - Integração com **OpenAI (GPT-4o)**.
  - Prompt inteligente que analisa: Objetivo, nível, frequência semanal (define divisão AB, ABC, ABCD) e limitações físicas — sempre com treino completo e equilibrado.
  - Editor de texto para refinar o treino antes de salvar.

### 📄 Geração e Entrega
- **PDF Automático:** Microserviço em Python que converte o treino em texto para um PDF profissional e formatado.
- **Integração com WhatsApp:** Botão para enviar o PDF e uma mensagem personalizada direto para o WhatsApp do aluno.

---

## 🛒 Planilhas prontas (entrega automática)

Fluxo: aluno escolhe a planilha em `/planilhas` → paga no Asaas (Pix/cartão/boleto) → o webhook marca como paga → a página `/planilhas/acesso/...` libera o download do PDF (com o nome do comprador) e o link é enviado no WhatsApp do aluno (se a Evolution API estiver configurada).

**Para colocar no ar:**
1. Aplicar a migração no banco: `npx prisma migrate deploy` (inclua no comando de build/deploy).
2. (Opcional) Criar 3 planilhas de exemplo como rascunho: `node scripts/seed-planilhas.mjs`.
3. Revisar/editar em **/admin/planilhas** e marcar "À venda".
4. Variáveis: `APP_BASE_URL=https://felipepersonal.com`, `ASAAS_API_KEY`, `PRODUCT_PRICE_CENTS` (preço do personalizado) e, para envio automático no WhatsApp, `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCE`.
5. No Asaas, o webhook deve apontar para `/api/asaas/webhook` (ou `/api/webhooks/asaas`) e o domínio `felipepersonal.com` precisa estar cadastrado para o redirecionamento pós-pagamento.

Textos, WhatsApp, foto, depoimentos e vídeos do site: `src/lib/site.ts`. Roteiros de vídeos: `docs/roteiros-videos.md`.

## 🛠️ Tecnologias Utilizadas

- **Frontend & Backend:** Next.js 15 (App Router), React, TypeScript.
- **Banco de Dados:** PostgreSQL (via Prisma ORM).
- **Estilização:** Tailwind CSS + Shadcn/ui.
- **Inteligência Artificial:** OpenAI API (GPT-4o-mini).
- **Pagamentos:** Asaas API (Integração Pix + Webhooks/Redirecionamento).
- **Microserviço PDF:** Python (Flask + ReportLab) hospedado no Render.

---

## ⚙️ Configuração e Instalação

### Pré-requisitos
- Node.js instalado.
- Conta no Asaas (Sandbox ou Produção).
- Conta na OpenAI.
- Banco de dados PostgreSQL (Local ou Neon/Supabase).

### 1. Clone o repositório
```bash
git clone [https://github.com/seu-usuario/treino-ai.git](https://github.com/seu-usuario/treino-ai.git)
cd treino-ai