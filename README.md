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
  - Prompt inteligente que analisa: Frequência semanal (define divisão AB, ABC, ABCD), Gênero (ênfase muscular) e Limitações físicas.
  - Editor de texto para refinar o treino antes de salvar.

### 📄 Geração e Entrega
- **PDF Automático:** Microserviço em Python que converte o treino em texto para um PDF profissional e formatado.
- **Integração com WhatsApp:** Botão para enviar o PDF e uma mensagem personalizada direto para o WhatsApp do aluno.

---

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