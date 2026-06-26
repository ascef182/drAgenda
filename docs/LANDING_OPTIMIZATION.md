# DrAgenda — Plano de Otimização da Landing Page

> Lançamento na UE (Portugal/Espanha) com tráfego pago, sob GDPR, cobrança em EUR.
> Este plano respeita o `CLAUDE.md` (fonte da verdade) e a regra de memória **"anunciar apenas o que está construído"**.
> Prioridades: **P0** = bug + EUR + remover alegações falsas · **P1** = i18n/SEO/cookies · **P2** = polimento visual/perf.

---

## 0. Resumo executivo

| # | Item | Prioridade | Status |
|---|------|-----------|--------|
| 1 | Bug do `.reveal` (página em branco em produção) | **P0** | ✅ **Corrigido** |
| 2 | Preços em EUR (`R$ 149` → `€ 69`) na landing | **P0** | ✅ **Feito** (Stripe ainda cobra BRL — criar Price EUR) |
| 3 | Remover/ajustar alegações não construídas | **P0** | ✅ **Feito** |
| 4 | i18n pt-PT / es-ES | **P1** | 🔴 Planejado |
| 5 | SEO / OG / metadata / locale UE | **P1** | 🔴 Planejado |
| 6 | Cookie consent antes de analytics/pixels (GDPR) | **P1** | 🔴 Planejado |
| 7 | Polimento visual (inspiração "Nexora") | **P2** | 🔴 Planejado |
| 8 | Performance / acessibilidade | **P2** | 🔴 Planejado |

> Itens 1, 2 e 3 já aplicados em código (aprovados pelo dono: preço **€69/mês**, prova social → value-props reais, manter só a landing em EUR por ora).
>
> ⚠️ **Pendência crítica do item 2:** o checkout do Stripe ainda cobra **BRL 5900**. Antes de rodar ads/cobrar na UE, criar um Price em EUR no painel Stripe e apontar `create-stripe-checkout` para ele (decidido: feito via env var num passo seguinte).

---

## 1. [P0 — FEITO] Bug do `.reveal`: landing em branco em produção

### Sintoma
Na produção (Vercel), **apenas um botão renderiza**; o restante da landing fica invisível.

### Investigação realizada (com evidência da Vercel)
Projeto Vercel: `dr-agenda` (`prj_tIfoCwaCBpWonWkSrWVypva2gU1R`), team `ascef182's projects`.

- **Build:** o deployment de produção mais recente (`dpl_47Cx4xASsYvr9Ymzfzfwdi2bCA8i`, commit `040aba2`) está em estado **`READY`** — o build passou, sem erro de compilação.
- **Runtime errors:** o único cluster de erro em runtime é
  `StripeSignatureVerificationError` na rota **`/api/stripe/webhook`** (17 ocorrências). Não afeta a rota `/` (landing). É problema separado de configuração do webhook (raw body / `STRIPE_WEBHOOK_SECRET`).
- **Assets:** `/public/logo.svg` existe (usado em `nav.tsx` e `footer.tsx`). Nenhum asset 404.
- **Rota `/`:** prerenderizada como estática (`○`) no build local — o HTML completo é gerado no servidor.

Conclusão: **não há falha de build, asset ou runtime de servidor.** A causa é puramente client-side, conforme a hipótese.

### Causa raiz confirmada
Em `src/app/globals.css`, a utility `.reveal` aplicava `opacity: 0` de forma **incondicional**:

```css
.reveal { opacity: 0; transform: translateY(16px); ... }
.reveal.reveal-in { opacity: 1; transform: translateY(0); }
```

A classe `.reveal-in` (que torna o conteúdo visível) só é adicionada por `src/app/_components/landing/reveal.tsx` via `IntersectionObserver` no cliente. Em `src/app/page.tsx`, **quase todas as seções** estão dentro de `<Reveal>`. Logo, se o JS do cliente não roda/hidrata (erro de hidratação, JS bloqueado, falha de chunk), todo o conteúdo `Reveal` fica **permanentemente `opacity: 0`** — só elementos fora de `<Reveal>` (botões do nav/hero) aparecem. Isto explica exatamente "só o botão aparece".

### Correção aplicada (progressive enhancement)
Conteúdo agora é **visível por padrão**; o estado oculto só é aplicado quando o JS está pronto.

- **`src/app/layout.tsx`** — adicionado um `<head>` com script inline que roda o mais cedo possível:
  ```js
  document.documentElement.classList.add('js-ready');
  ```
- **`src/app/globals.css`** — o estado oculto agora é escopado por `.js-ready`:
  ```css
  .js-ready .reveal { opacity: 0; transform: translateY(16px); ... }
  .js-ready .reveal.reveal-in { opacity: 1; transform: translateY(0); }
  ```
  O bloco `@media (prefers-reduced-motion: reduce)` também foi escopado por `.js-ready` (continua forçando visibilidade).

Resultado: sem JS, nunca há `.js-ready`, então `.reveal` nunca recebe `opacity: 0` → **conteúdo sempre visível**. Com JS, o script seta `.js-ready` antes do paint e a animação funciona normalmente para usuários normais (sem flash de conteúdo).

### Verificação
- `npm run build` (Next 16, Turbopack): **✓ Compiled successfully**, TypeScript OK, rota `/` prerenderizada estática. Sem regressão.

### Melhoria opcional futura (não bloqueante)
- Investigar a causa secundária: se há um erro de hidratação real em produção, vale corrigi-lo também (o fix acima protege o usuário, mas a animação ficaria desabilitada para quem tem hidratação quebrada). Verificar console do navegador na URL de produção.

---

## 2. [P0] Preços em EUR (PT/ES)

**Arquivo:** `src/app/_components/landing/pricing-simple.tsx`

Hoje exibe `R$` + `149` + `/mês` (linhas 51-59). Para a UE:

- Trocar símbolo `R$` por `€` e o valor por um preço **em EUR** definido pelo negócio (ex.: `€ 49 /mês` — valor a confirmar pelo dono).
- O preço do Stripe em produção hoje é **BRL 5900** (`price_1RWowY...`, `currency: brl`, visto nos webhooks). É preciso **criar um Price em EUR no Stripe** e apontar `create-stripe-checkout` para ele (ou usar Price por moeda/localização).
- `dashboard-mockup.tsx` / `features-bento.tsx` (`R$ 18.590`, `R$` no MiniChart) também usam `R$` — alinhar à moeda exibida na landing UE.
- Formatação: usar separadores europeus (`€ 1.234,56` PT vs `1.234,56 €`) — idealmente via `Intl.NumberFormat` com locale.

> ⚠️ Não alterado em código — preço é decisão comercial e precisa de sign-off + Price EUR no Stripe.

---

## 3. [P0] Anunciar apenas o que está construído

Cruzamento com `src/services/`, `src/actions/` e `src/data/`. Serviços existentes: `appointments.ts`, `messaging.ts` (stub). Actions: appointments, doctors, patients, clinic, stripe-checkout. **Não há** WhatsApp ativo, backup, suporte por chat, nem audit log implementados (são Fases 5/4 no roadmap).

| Alegação na landing | Arquivo | Construído? | Ação recomendada |
|---|---|---|---|
| "WhatsApp automático" (metadata title/desc + OG + twitter) | `src/app/layout.tsx` (linhas 18, 22, 30) | ❌ `messaging.ts` é só stub/`console.log` (Fase 5) | **Remover** da metadata, ou mover para selo "em breve". Não anunciar como entregue. |
| "Backup diário" | `pricing-simple.tsx` linha 14 | ❌ Não há rotina de backup no código | **Remover** do `includes` ou marcar "em breve". (Backup de infra do Postgres não é feature do produto anunciável como tal.) |
| "Suporte por chat" | `pricing-simple.tsx` linha 13 | ❌ Não há chat/suporte implementado | **Remover** ou substituir por canal real (ex.: "Suporte por email"). |
| "Relatórios financeiros" | `pricing-simple.tsx` linha 12 | ⚠️ Parcial: dashboard calcula receita (`get-dashboard.ts`), mas não há "relatórios" exportáveis | Suavizar para "Dashboard financeiro" (o que existe), evitando prometer relatórios. |
| "relatórios separados por profissional" | `faq.tsx` linha 12 | ⚠️ Parcial — há receita por médico no dashboard, não relatório dedicado | Reescrever para "visão por profissional no dashboard". |
| "logs de auditoria" (LGPD) | `faq.tsx` linha 20 | ❌ Audit log é Fase 4 (não implementado) | **Remover** a menção a logs de auditoria. |
| "backup diário" (FAQ) | `faq.tsx` linha 20 | ❌ idem | **Remover**. |
| "criptografia em repouso e em trânsito" | `faq.tsx` linha 20 | ⚠️ Em trânsito (HTTPS) sim; em repouso depende do provedor de DB | Manter só o que é verdade; remover "em repouso" se não garantido. |
| "Visão financeira em tempo real" | `roi.tsx` linha 13 | ✅ Dashboard real | OK (atualizar à medida que muda). |
| Métricas "+500 clínicas, +50.000 consultas/mês, 98% satisfação" | `social-proof.tsx` linhas 1-5 | ❌ Inventadas (produto em lançamento) | **Remover** ou substituir por prova social real. Produto pré-lançamento não deve exibir métricas falsas (risco legal de publicidade enganosa na UE, além da regra de memória). |
| Logos "Clínica Aurora", "Instituto Vida+" etc. | `social-proof.tsx` linhas 7-13 | ❌ Placeholders fictícios | **Remover** até ter clientes reais, ou rotular como ilustrativo. |

> A regra de memória do projeto: features futuras (WhatsApp, auditoria, RBAC) são **upgrades pagos / "em breve"**, não devem ser vendidas como já incluídas.
>
> Estratégia recomendada: criar um array de features "incluídas" (reais) e outro "em breve" (roadmap), e renderizar os "em breve" com selo discreto. Isso preserva o apelo de marketing sem alegação falsa.
>
> ⚠️ Não alterado em código — promessas comerciais precisam de sign-off do dono.

---

## 4. [P1] i18n pt-PT / es-ES

Hoje: `lang="pt-BR"` (`layout.tsx` linha 40) e `locale: "pt_BR"` (linha 23). Todo o copy está em pt-BR e usa "R$".

**Abordagem recomendada (plano, não implementar agora):**
- Adotar **`next-intl`** (integra bem com App Router/Next 16, suporta rotas localizadas `/[locale]`).
- Locales-alvo: `pt-PT` (primário PT), `es-ES` (ES). Manter `pt-BR` se ainda houver mercado BR, senão depreciar.
- Extrair todo o copy dos componentes de `landing/` para arquivos de mensagens (`messages/pt-PT.json`, `messages/es-ES.json`).
- Ajustar `<html lang>` dinamicamente pelo locale.
- Formatação de moeda/data via `Intl` por locale (conecta ao item 2).
- Ajustar vocabulário pt-PT (ex.: "marcação" em vez de "agendamento", "consultório/clínica", "telemóvel") — revisão por falante nativo PT.
- SEO: `hreflang` por locale + `alternates` na metadata.

Esforço: médio. É refactor de copy, não de lógica. Deve vir **depois** de congelar o copy final (itens 2 e 3).

---

## 5. [P1] SEO / OG / metadata / locale UE

**Arquivo:** `src/app/layout.tsx`

- `openGraph.locale` deve refletir UE: `pt_PT` / `es_ES` (hoje `pt_BR`).
- **Falta `metadataBase`** — necessário para URLs absolutas de OG/twitter. Adicionar `metadataBase: new URL("https://<dominio-producao>")`.
- **Falta imagem OG** (`openGraph.images` / `twitter.images`). Criar uma imagem OG 1200x630 (ex.: `public/og.png` ou rota `opengraph-image`) e referenciar. Hoje `twitter.card` é `summary_large_image` mas não há imagem → preview vazio.
- **Favicon:** verificar `src/app/icon.*` / `favicon.ico`. Hoje só existem SVGs genéricos em `public/` (`logo.svg`, `next.svg`...). Adicionar `app/icon.png` e `app/apple-icon.png`.
- Remover do título/descrição a alegação "WhatsApp automático" (ver item 3) — também é SEO honesto.
- Adicionar `alternates.canonical` e, com i18n, `alternates.languages` (hreflang).
- `robots`/sitemap: adicionar `app/robots.ts` e `app/sitemap.ts`.
- Remover assets de template não usados (`public/next.svg`, `vercel.svg`, `window.svg`, `file.svg`, `globe.svg`) para limpeza.

---

## 6. [P1] Cookie consent antes de analytics/ad pixels (GDPR)

Para tráfego pago na UE, qualquer pixel (Meta/Google Ads), Analytics ou cookie não essencial exige **consentimento prévio explícito** (GDPR/ePrivacy).

**Plano:**
- Implementar um **Consent Management** (banner) que bloqueia o carregamento de scripts de marketing/analytics até o opt-in. Opções: solução própria leve + `next/script` com `strategy` condicional, ou CMP (Cookiebot, Osano, Iubenda).
- Categorias: **necessários** (sempre on) vs **analytics/marketing** (opt-in).
- Só injetar GA4 / Meta Pixel / Google Ads tag **após** consentimento (Google Consent Mode v2 recomendado para Ads na UE).
- Adicionar páginas: **Política de Privacidade**, **Política de Cookies** (o footer já tem link "LGPD" em `footer.tsx` linha 28 → trocar por **RGPD/GDPR** e apontar para página real, não `#`).
- Hoje **não há** pixel/analytics no código — vantagem: implementar consent **antes** de adicionar qualquer pixel evita retrabalho.

---

## 7. [P2] Polimento visual (inspiração "Nexora" / "Grow Your Revenue Faster")

Referências em `public/inspiration/` (estilo SaaS azul moderno: hero + dashboard, prova social, bento, números/ROI). A landing já segue essa linha (primary azul `oklch(0.623 0.214 259.815)`, bento em `features-bento.tsx`, mockup de dashboard). Refinamentos:

- **Hero:** mockup de dashboard com mais profundidade (sombra suave + leve perspectiva/tilt), gradiente azul mais rico no topo. Manter o headline forte.
- **Prova social:** **somente métricas reais** (ver item 3). Enquanto não houver clientes, substituir números por *value props* (ex.: "Multi-tenant", "Constraint anti-conflito no banco", "LGPD-ready") ou depoimentos reais.
- **Bento (`features-bento.tsx`):** já bom; padronizar alturas das células e os mini-charts; garantir que o `ResponsiveContainer` tenha `minHeight` para eliminar o warning de chart `width(-1)/height(-1)` visto no build.
- **ROI/números:** seção de números só com dados reais ou simulação claramente rotulada ("exemplo ilustrativo").
- **Consistência:** seções alternando `bg-muted/30` já criam ritmo; manter espaçamento vertical consistente (`py-20 md:py-28`).
- **CTA final:** reforçar o trial "14 dias sem cartão" (já presente no hero) também no CTA final.

> Para a execução visual, considerar a skill `ui-ux-pro-max` com o estilo bento/SaaS azul, mantendo o design system atual (tokens em `globals.css`).

---

## 8. [P2] Performance e acessibilidade (quick wins)

- **Chart warnings no build:** `features-bento.tsx` (MiniChart) e mockups geram `width(-1)/height(-1)` durante SSR. Dar `minHeight`/`minWidth` ao `ResponsiveContainer` ou renderizar charts só no cliente (`dynamic(..., { ssr: false })`).
- **Fonte:** `Manrope` via `next/font` já é otimizada (bom). Considerar `display: "swap"` (default) e subset.
- **Imagens:** `next/image` já usado para o logo. Para a imagem OG e quaisquer screenshots, usar `next/image` com `width/height` corretos.
- **Acessibilidade:**
  - O accordion da FAQ usa `<details>/<summary>` nativo (bom para a11y/no-JS).
  - Garantir contraste do texto `text-muted-foreground` sobre `bg-muted/30` (verificar AA).
  - `social-proof.tsx`: logos como texto têm `aria-label`; ao trocar por imagens, manter `alt`.
  - Verificar foco visível em todos os botões/links (Tailwind ring já configurado em `globals.css`).
- **`prefers-reduced-motion`:** já respeitado no `globals.css` (mantido na correção do item 1).
- **Lighthouse:** rodar em produção após o fix do item 1 para baseline de LCP/CLS (o hero com mockup é o provável LCP).

---

## Apêndice — Arquivos relevantes

| Tema | Arquivo |
|---|---|
| Bug reveal (corrigido) | `src/app/globals.css`, `src/app/layout.tsx`, `src/app/_components/landing/reveal.tsx` |
| Composição da página | `src/app/page.tsx` |
| Preço | `src/app/_components/landing/pricing-simple.tsx` |
| Alegações | `pricing-simple.tsx`, `faq.tsx`, `social-proof.tsx`, `roi.tsx`, `features-bento.tsx`, `hero.tsx`, `layout.tsx` |
| Metadata/SEO | `src/app/layout.tsx` |
| Footer (links legais) | `src/app/_components/landing/footer.tsx` |
| Messaging (stub WhatsApp) | `src/services/messaging.ts` |
| Stripe checkout (moeda) | `src/actions/create-stripe-checkout/` |
| Dashboard (financeiro real) | `src/data/get-dashboard.ts` |
