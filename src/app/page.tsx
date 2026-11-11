import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { ProductCard } from "@/components/site/ProductCard";
import { getActiveProducts } from "@/lib/products";
import { YouTubeLite } from "@/components/site/YouTubeLite";
import { MobileCtaBar } from "@/components/site/MobileCtaBar";
import { faq, heroVideoId, personalizedPriceCents, site, testimonials, videos } from "@/lib/site";
import { formatBRL } from "@/lib/utils";

export const dynamic = "force-dynamic";

const forWho = [
  ["Treina sem saber se está evoluindo", "Cada semana tem séries, repetições e progressão definidas. Você sabe exatamente o que fazer."],
  ["Já copiou treino da internet e não viu resultado", "Programas com lógica de divisão e volume — não uma lista aleatória de exercícios."],
  ["Não tem tempo ou dinheiro para personal presencial", "Orientação profissional pelo preço de um lanche, no seu horário."],
  ["Está começando e tem medo de errar", "Opções para iniciantes com aquecimento, carga e cuidados explicados passo a passo."],
];

const trust = [
  `Personal com registro ${site.cref}`,
  "Pix, cartão ou boleto",
  `Garantia de ${site.guaranteeDays} dias`,
  "PDF para treinar em qualquer lugar",
];

export default async function Home() {
  const products = await getActiveProducts();
  const personalizedPrice = formatBRL(personalizedPriceCents());
  const minProductPrice = products.length ? Math.min(...products.map((p) => p.priceCents)) : null;

  return (
    <div className="bg-zinc-50 pb-24 text-zinc-900 md:pb-0">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.25),transparent_60%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[1.3fr_1fr] md:items-center md:py-24">
          <div>
            <span className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-emerald-300">
              Consultoria de treino online
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Pare de treinar no improviso.{" "}
              <span className="text-emerald-400">Siga um plano feito por um personal.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              Planilhas prontas com entrega imediata ou um treino 100% personalizado para o seu objetivo, rotina e
              nível. Séries, repetições, descanso e progressão — tudo explicado.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={products.length ? "/planilhas" : "/personalizado"}
                className="rounded-xl bg-emerald-500 px-6 py-4 text-center text-base font-bold text-zinc-950 shadow-lg hover:bg-emerald-400"
              >
                {products.length && minProductPrice
                  ? `Planilhas a partir de ${formatBRL(minProductPrice)}`
                  : `Quero meu treino por ${personalizedPrice}`}
              </Link>
              <Link
                href="/#planos"
                className="rounded-xl border border-white/20 px-6 py-4 text-center text-base font-semibold hover:bg-white/10"
              >
                Comparar opções
              </Link>
            </div>
            <ul className="mt-8 grid gap-2 text-sm text-zinc-300 sm:grid-cols-2">
              {trust.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="mx-auto w-full max-w-sm">
            {heroVideoId ? (
              <YouTubeLite id={heroVideoId} title={`Conheça o método do ${site.name}`} vertical />
            ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
              <Image
                src={site.photo}
                alt={site.name}
                width={220}
                height={220}
                priority
                className="mx-auto rounded-full border-4 border-emerald-500/40 object-cover"
              />
              <div className="mt-4 text-xl font-extrabold">{site.name}</div>
              <div className="text-sm text-zinc-400">Personal Trainer • {site.cref}</div>
            </div>
            )}
          </div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <h2 className="text-center text-3xl font-extrabold tracking-tight">É pra você se…</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {forWho.map(([t, d]) => (
            <div key={t} className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                ✓
              </span>
              <div>
                <div className="font-bold">{t}</div>
                <p className="mt-1 text-sm text-zinc-600">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Escolha como quer treinar</h2>
          <p className="mt-3 text-zinc-600">
            Comece com uma planilha pronta ou receba um plano montado do zero para você.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="flex flex-col rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="text-sm font-bold uppercase tracking-wide text-zinc-500">Planilhas prontas</div>
            <div className="mt-2 text-3xl font-extrabold">
              {minProductPrice ? <>a partir de {formatBRL(minProductPrice)}</> : "Em breve"}
            </div>
            <p className="mt-3 text-zinc-600">Programas completos por objetivo e nível. Pagou, baixou, começou.</p>
            <ul className="mt-6 space-y-2 text-sm text-zinc-700">
              <li>✓ Entrega imediata em PDF</li>
              <li>✓ Semanas organizadas com progressão</li>
              <li>✓ Séries, repetições e descanso definidos</li>
              <li>✓ Ideal para quem quer começar hoje</li>
            </ul>
            <Link
              href="/planilhas"
              className="mt-8 rounded-xl border border-zinc-900 px-6 py-3 text-center font-bold hover:bg-zinc-900 hover:text-white"
            >
              Ver planilhas
            </Link>
          </div>

          <div className="relative flex flex-col rounded-3xl border-2 border-emerald-500 bg-white p-8 shadow-lg">
            <span className="absolute -top-3 left-8 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
              MAIS COMPLETO
            </span>
            <div className="text-sm font-bold uppercase tracking-wide text-emerald-700">Treino personalizado</div>
            <div className="mt-2 text-3xl font-extrabold">{personalizedPrice}</div>
            <p className="mt-3 text-zinc-600">Montado do zero a partir da sua avaliação e revisado por mim.</p>
            <ul className="mt-6 space-y-2 text-sm text-zinc-700">
              <li>✓ Anamnese completa + PAR-Q de saúde</li>
              <li>✓ Adaptado à sua rotina, local e equipamentos</li>
              <li>✓ Considera dores e limitações</li>
              <li>✓ PDF enviado no seu WhatsApp</li>
            </ul>
            <Link
              href="/personalizado"
              className="mt-8 rounded-xl bg-emerald-600 px-6 py-3 text-center font-bold text-white hover:bg-emerald-700"
            >
              Quero meu treino personalizado
            </Link>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="mt-14">
            <div className="flex items-end justify-between">
              <h3 className="text-xl font-extrabold">Planilhas mais procuradas</h3>
              <Link href="/planilhas" className="text-sm font-semibold text-emerald-700 hover:underline">
                Ver todas →
              </Link>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {products.slice(0, 3).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {/* COMO FUNCIONA */}
      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-3xl font-extrabold tracking-tight">Como funciona</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ["1", "Escolha seu plano", "Planilha pronta para começar já, ou personalizado se quer algo sob medida."],
              ["2", "Pague com segurança", "Pix, cartão ou boleto. A confirmação é automática."],
              ["3", "Comece a treinar", "Planilha: download na hora. Personalizado: PDF no seu WhatsApp após minha revisão."],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-2xl bg-zinc-50 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 font-bold text-white">
                  {n}
                </div>
                <div className="mt-4 text-lg font-bold">{t}</div>
                <p className="mt-1 text-sm text-zinc-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VÍDEOS (só aparece com vídeos cadastrados em src/lib/site.ts) */}
      {videos.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 pt-16">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight">Veja como eu treino</h2>
            <p className="mt-2 text-zinc-600">Dicas de execução e treinos reais — o mesmo cuidado que vai na sua planilha.</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {videos.map((v) => (
              <YouTubeLite key={v.id} id={v.id} title={v.title} vertical />
            ))}
          </div>
        </section>
      ) : null}

      {/* SOBRE */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[auto_1fr] md:items-center">
        <Image
          src={site.photo}
          alt={site.name}
          width={260}
          height={260}
          className="mx-auto rounded-3xl object-cover shadow-lg"
        />
        <div>
          <div className="text-sm font-bold uppercase tracking-wide text-emerald-700">Quem vai montar seu treino</div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Prazer, eu sou o {site.name}</h2>
          <p className="mt-4 leading-relaxed text-zinc-600">
            Sou personal trainer registrado no conselho ({site.cref}). Criei esta consultoria online para que mais
            pessoas tenham acesso a um treino bem planejado — com a lógica de divisão, volume e progressão que uso com
            meus alunos presenciais — por um preço acessível e sem depender de horário.
          </p>
          <p className="mt-3 leading-relaxed text-zinc-600">
            Nada de ficha genérica de academia: cada planilha tem objetivo claro, e o treino personalizado é revisado
            por mim antes de chegar até você.
          </p>
        </div>
      </section>

      {/* DEPOIMENTOS (só aparece com depoimentos reais cadastrados em src/lib/site.ts) */}
      {testimonials.length > 0 ? (
        <section className="bg-zinc-950 text-white">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-center text-3xl font-extrabold tracking-tight">O que dizem os alunos</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure key={t.name} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  {t.result ? <div className="text-sm font-bold text-emerald-400">{t.result}</div> : null}
                  <blockquote className="mt-2 text-zinc-200">“{t.text}”</blockquote>
                  <figcaption className="mt-4 text-sm text-zinc-400">— {t.name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* GARANTIA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center md:flex-row md:text-left">
          <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-4 border-emerald-500 bg-white font-extrabold text-emerald-700">
            <span className="text-3xl leading-none">{site.guaranteeDays}</span>
            <span className="text-xs">DIAS</span>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">Garantia incondicional de {site.guaranteeDays} dias</h2>
            <p className="mt-2 text-zinc-700">
              Se você não gostar, é só me chamar no WhatsApp dentro de {site.guaranteeDays} dias e devolvo seu dinheiro.
              Sem perguntas.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 pb-8">
        <h2 className="text-center text-3xl font-extrabold tracking-tight">Perguntas frequentes</h2>
        <div className="mt-8 space-y-3">
          {faq.map((item) => (
            <details key={item.q} className="group rounded-2xl border border-zinc-200 bg-white p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {item.q}
                <span className="text-zinc-400 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <div className="rounded-3xl bg-zinc-900 px-6 py-12 text-center text-white">
          <h2 className="text-3xl font-extrabold tracking-tight">Seu próximo treino já pode ser o certo.</h2>
          <p className="mx-auto mt-3 max-w-xl text-zinc-300">
            Escolha uma planilha e comece hoje, ou peça seu treino sob medida.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/planilhas" className="rounded-xl bg-emerald-500 px-6 py-4 font-bold text-zinc-950 hover:bg-emerald-400">
              Ver planilhas
            </Link>
            <Link href="/personalizado" className="rounded-xl border border-white/20 px-6 py-4 font-semibold hover:bg-white/10">
              Treino personalizado
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
      <WhatsAppFloat />
      <MobileCtaBar
        href="/#planos"
        label={minProductPrice ? `Começar agora • a partir de ${formatBRL(minProductPrice)}` : `Quero meu treino • ${personalizedPrice}`}
        note={`Garantia de ${site.guaranteeDays} dias • Pix ou cartão`}
      />
    </div>
  );
}
