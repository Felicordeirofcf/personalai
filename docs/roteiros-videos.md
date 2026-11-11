# Roteiros de vídeos — academia, treinos e explicações

Vídeos curtos (20–45 s) gravados com o celular na vertical. Use os mesmos vídeos em três lugares:

1. **Instagram Reels / TikTok**: atraem gente nova (tráfego).
2. **YouTube Shorts**: é de lá que o site puxa os vídeos.
3. **Site**: a seção "Veja como eu treino" mostra que existe um profissional de verdade por trás das planilhas.

## Como colocar no site

1. Suba o vídeo no YouTube (Shorts serve).
2. Copie o ID do link. Em `https://youtube.com/shorts/AbC123xyz`, o ID é `AbC123xyz`.
3. Em `src/lib/site.ts`, adicione o vídeo:

```ts
export const heroVideoId = "IdDoVideoDeApresentacao"; // aparece no topo do site
export const videos = [
  { id: "AbC123xyz", title: "Agachamento: 3 erros que travam seu resultado" },
  // até 4–8 vídeos
];
```

A seção de vídeos só aparece quando a lista tem pelo menos um vídeo.

## Dicas de gravação (sem gastar nada)

- Celular na vertical, na altura do peito, apoiado num tripé ou numa anilha.
- Luz de frente para você, nunca de costas para a janela.
- Use microfone de lapela (a partir de R$ 30) ou grave a narração depois, em local silencioso.
- **Os 2 primeiros segundos decidem tudo**: comece pelo gancho, sem "oi gente".
- Coloque legenda (o CapCut gera automático). A maioria assiste sem som.
- Termine sempre com **uma** chamada: "Link na bio" ou "Comenta TREINO que eu te mando".
- Peça autorização antes de filmar outras pessoas na academia.

---

## 1. Vídeo de apresentação (vai no topo do site), 30–40 s

> **Gancho:** "Se você treina e não sabe se está evoluindo, esse vídeo é pra você."
> **Corpo:** "Eu sou o Felipe, personal trainer, CREF 071550-RJ. Montei planilhas de treino com a mesma lógica que uso com meus alunos presenciais: divisão certa, séries, repetições, descanso e progressão semana a semana. E se você quer algo 100% seu, eu monto seu treino personalizado a partir da sua avaliação."
> **CTA:** "Escolha sua planilha no site. Você recebe na hora, com 7 dias de garantia."

*Cenas:* você falando para a câmera na academia → cortes rápidos de você treinando → a tela do celular mostrando o PDF.

## 2. "3 erros no agachamento", 30 s

> **Gancho:** "Seu agachamento não cresce sua perna por causa disso."
> **Corpo:** Erro 1: joelho caindo para dentro (mostre errado ✗ e certo ✓). Erro 2: descer pouco. Erro 3: tirar o calcanhar do chão.
> **CTA:** "Na minha planilha de hipertrofia, cada exercício vem com a execução certa. Link na bio."

## 3. "Treino de glúteo em 4 exercícios", 40 s

> **Gancho:** "Treino de glúteo que eu passo pras minhas alunas."
> **Corpo:** Elevação pélvica, búlgaro, abdução e coice na polia, uns 5 s de cada mostrando execução, com séries e repetições na legenda.
> **CTA:** "O programa completo de 8 semanas está na planilha Glúteos & Pernas. Link na bio."

## 4. "Iniciante: comece por aqui", 30 s

> **Gancho:** "Primeira vez na academia? Não faça isso."
> **Corpo:** "Não copie o treino do marombeiro. Comece com corpo todo 3x por semana, carga que você controla e aumente um pouco a cada semana."
> **CTA:** "Montei uma planilha de 12 semanas exatamente pra isso. Link na bio."

## 5. "Treino em casa sem equipamento", 30 s

> **Gancho:** "Sem tempo pra academia? 30 minutos na sala resolvem."
> **Corpo:** Mostre o circuito: agachamento, flexão, polichinelo, afundo, prancha e corrida parada.
> **CTA:** "As 6 semanas completas estão na planilha Emagrecimento em Casa."

## 6. "Quantas séries para crescer?", 25 s

> **Gancho:** "Mais séries não significam mais músculo."
> **Corpo:** Explique de forma simples o volume semanal e por que a progressão de carga importa mais do que fazer 20 séries.
> **CTA:** "Comenta TREINO que eu te mando como montar a sua semana."

## 7. "Mito × verdade", série recorrente, 20 s cada

> Exemplos: "Abdominal queima gordura da barriga?", "Musculação deixa mulher masculinizada?", "Precisa treinar todo dia?"
> Formato: a pergunta na tela, você responde em 15 s e encerra com "Segue pra mais".

## 8. "Um dia de treino comigo", 45 s

> Cortes rápidos de você treinando, com legenda do exercício, séries × repetições e um comentário curto em cada um.
> **CTA:** "Quer um treino montado pra você? Link na bio."

## 9. Prova social, quando tiver resultados

> Print (com autorização) da mensagem de um aluno ou antes/depois.
> "Isso aqui é o que acontece quando você segue um plano de verdade."
> Os melhores depoimentos também entram em `src/lib/site.ts` → `testimonials`.

## 10. "Por dentro da planilha", 25 s

> Grave a tela do celular rolando o PDF: semanas, treinos, séries, orientações.
> **Gancho:** "É isso que você recebe quando compra minha planilha."
> **CTA:** "Pagou, baixou, começou. Link na bio."

---

### Ritmo sugerido

3 a 5 vídeos por semana. Grave 5 a 6 vídeos num único dia de academia e publique ao longo da semana.
