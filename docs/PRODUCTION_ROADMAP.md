# DrAgenda — Roadmap de Produção, Escala, Cybersegurança & RGPD (lançamento UE)

> Documento de planeamento. Consolida o diagnóstico do estado atual e o caminho para produção.
> Não substitui o `CLAUDE.md` (fonte da verdade de arquitetura) — complementa-o no eixo operacional.
> **Alvo de lançamento: União Europeia (Portugal / Espanha), com ads.**

---

## Contexto

Objetivo: levar o DrAgenda a produção como um software de alta qualidade, escalar **conforme o número de
usuários cresce**, e **lançar na UE (Portugal ou Espanha) com ads**.

**Premissa legal (UE, não Brasil):**
- Lei aplicável: **RGPD/GDPR** (UE 2016/679) + **Lei 58/2019** (PT) / **LOPDGDD** (ES).
- Dado de saúde = **categoria especial (Art. 9)** → base legal reforçada, proteções técnicas, **residência de dados na UE**.
- Faturação em **EUR + IVA** (Stripe Tax); idioma **pt-PT / es-ES**.

---

## Parte 1 — Diagnóstico

### ✅ Pontos fortes
- Arquitetura em camadas real (UI → Actions → Services → Data → DB), documentada no `CLAUDE.md`.
- Isolamento multi-tenant na service layer (`clinicId` da sessão, nunca do cliente).
- Anti-double-booking no banco: `unique("appointments_doctor_date_unique")` (`src/db/schema.ts`).
- Stack atual: Next 16, React 19, Drizzle, better-auth, Stripe, TS strict, Zod, next-safe-action.
- Sem segredos versionados (`.gitignore` cobre `.env*`). Webhook Stripe verifica assinatura. DEV MODE seguro.

### 🔴 Lacunas
**P0 — bloqueiam produção / quebram em escala**
1. Pooling de conexão não tunado — `src/db/index.ts` usa `drizzle(databaseUrl)` cru.
2. Zero testes automatizados.
3. Sem CI/CD (não há `.github/`).
4. Sem observabilidade (Sentry, log estruturado, `/health`, uptime).
5. Sem rate limiting em auth/actions.

**P1**
6. Webhook Stripe frágil — plano hardcoded, sem idempotência, `throw` vira 500, só 2 eventos.
7. RGPD/saúde não implementado — sem audit log, exportação/exclusão, residência UE garantida, DPA/ROPA.
8. Billing por usuário, plano único; sem EUR/IVA.
9. Service layer incompleta (`doctors`/`patients` — Fase 2 do `CLAUDE.md`).

**P2**: fila/jobs (WhatsApp), multi-clínica hardcoded (`src/lib/auth.ts`), `src/proxy.ts` faz `fetch` por request.

### Veredito das dúvidas iniciais
| Dúvida | Veredito |
|---|---|
| GraphQL | ❌ Não adicionar — Server Actions + React Query já dão RPC type-safe. |
| Fila ("habbit") | 🟡 Só na fase WhatsApp, e **gerenciada** (Upstash/Inngest), não RabbitMQ self-hosted. |
| CI/CD | ✅ P0. |
| Policies | ✅ Segurança + RGPD + operação. |
| Escalabilidade | 🟡 Gargalo real = pooling + cache. |

---

## Parte 2 — Escala progressiva por número de usuários

| Degrau | Usuários | Infra | Adicionar neste degrau |
|---|---|---|---|
| **0 — MVP pago** | 1–50 | Vercel UE + Neon UE | Pooling, CI/CD, Sentry, `/health`, rate limit, backups Neon. |
| **1 — Tração** | 50–300 | Vercel Pro + Neon pago | Stripe tiers (EUR/IVA), log agregado, uptime, alertas. |
| **2 — Escala** | 300–1.000 | + Redis (Upstash) + fila gerenciada | Cache dashboard, fila WhatsApp, read replica, índices. |
| **3 — Crescimento** | 1.000–5.000 | + autoscaling/multi-região | Pooler dedicado, particionamento, CDN, testes de carga (k6). |
| **4 — Enterprise** | 5.000+ | Container/AWS (ECS+RDS+RDS Proxy) | Sharding/RLS, SLA, on-call, DR multi-região, SOC2. |

Para chegar a 1.000 usuários com folga (degraus 0–2): **pooling + cache + read replica + fila**, sem reescrita.

---

## Parte 3 — Cybersegurança

Modelo de ameaça: dados de saúde + pagamentos = alvo de alto valor. Vetores: cross-tenant, brute force,
vazamento de PII, abuso de API, fraude de billing.

**P0**
- Rate limiting + lockout em `/authentication` e actions sensíveis (Upstash Ratelimit).
- Security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy) — hoje só `reactStrictMode`.
- Auditar que toda query filtra por `clinicId` (teste que prove o isolamento).
- Webhook Stripe idempotente + verificação de assinatura.
- Senha forte + e-mail verificado obrigatório no better-auth.
- Secrets fora do código (ok) + rotação documentada.

**P1**
- RBAC (owner/admin/member) — Fase 3 do `CLAUDE.md`.
- Audit log (Fase 4) — acesso/alteração de dados de paciente.
- MFA/2FA (better-auth suporta).
- Criptografia at-rest (Postgres gerenciado); avaliar criptografia de campo para dados clínicos.
- Dependabot/CodeQL + revisão de dependências.
- Backups testados (restore drill) + runbook de incidente.

**P2**: WAF/bot protection, pentest pré-escala, bug bounty.

---

## Parte 4 — RGPD / proteção de dados (PT & ES)

Dado de saúde = categoria especial (Art. 9). Obrigatório antes/no lançamento:
- **Residência de dados na UE** (Vercel + Neon `eu-*`); evitar transferências fora da UE sem salvaguardas.
- **Base legal** definida (clínica = controller; DrAgenda = processor).
- **DPA** com clínicas e com subprocessadores (Vercel, Neon, Stripe…).
- **ROPA** (Art. 30).
- **Direitos do titular**: acesso, retificação, **portabilidade (exportação)**, **apagamento** — fluxo no produto.
- **Privacidade + Termos + Cookies** (pt-PT/es-ES) + consentimento de cookies/analytics.
- **Notificação de violação 72h** (Art. 33) + runbook.
- **Minimização e retenção** documentadas.

Recomendado: avaliar DPO/RPD; ISO 27001 se vender enterprise. Autoridades: CNPD (PT), AEPD (ES).

---

## Parte 5 — Lançamento UE & monetização

- Stripe EUR + **Stripe Tax** (IVA PT 23% / ES 21%); SEPA + cartões; tiers por clínica.
- i18n pt-PT / es-ES (`next-intl` ou equivalente).
- Analytics de funil consentido; pixels de ads só após opt-in de cookies.
- Benchmark: Doctolib, Doctoralia (PT/ES), tuotempo, Clinic Cloud (ES).

---

## Parte 6 — Roadmap por sprints

**Sprint 0 — Produção mínima viável (P0):**
- ✅ **Webhook Stripe endurecido** (`src/app/api/stripe/webhook/route.ts`): 400 em falha de assinatura, try/catch, logs.
- ✅ **CI** (`.github/workflows/ci.yml`): `tsc --noEmit` + `next build` em push/PR. (Lint omitido: `next lint` removido no Next 16 + flat config com erro circular — **follow-up: reparar ESLint**.)
- ✅ **Security headers** (`next.config.mjs`): nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS. (CSP adiada — há script inline `js-ready`; precisa nonce/hash.)
- ✅ **Health check** (`src/app/api/health/route.ts`): ping ao DB, 200/503. Verificado ao vivo (`{"status":"ok","db":"up"}`).
- 🟡 **Pooling**: já mitigado — Neon usa endpoint `-pooler` (PgBouncer). **Verificar** que o env de produção na Vercel usa a URL `-pooler`.
- 🔴 **Sentry** + uptime monitor: requer conta/DSN do usuário.
- 🔴 **Rate limiting**: requer Upstash Redis (in-memory não funciona em serverless multi-instância).
- 🔴 **Região UE** (RGPD): banco hoje em Neon `sa-east-1` (São Paulo). Migrar para região EU antes do lançamento.

**Sprint 1 — Confiança, RGPD & cobrança (P1):** Vitest na service layer (provar isolamento de tenant +
anti-double-booking); `DoctorService`/`PatientService` (Fase 2); Stripe tiers EUR/IVA + portal; RGPD base
(Privacidade/Termos pt-PT/es-ES, exportação + apagamento, DPA/ROPA, residência UE).

**Sprint 2 — Escala & automação (P2):** audit log (Fase 4) + RBAC (Fase 3); WhatsApp via fila gerenciada
(Fase 5) + `message_logs`; Redis/cache + read replica; otimizar `proxy.ts`; multi-clínica UX; i18n.

---

## Parte 7 — Hospedagem (decidir, em região UE)

| Opção | Quando | Pooling | Ops |
|---|---|---|---|
| **Vercel UE + Neon UE** | Lançar rápido, time pequeno | Neon pooled (obrigatório) | 🟢 Baixo |
| **Railway/Render/Fly.io UE** | Node longa duração | `pg.Pool` direto | 🟡 Médio |
| **AWS/GCP UE** | Só com escala/time infra | RDS Proxy | 🔴 Alto |

**Recomendação:** Vercel UE + Neon UE (degraus 0–2): chega a 1.000 usuários e resolve residência RGPD.
Drizzle mantém o banco portável para migrar depois.

---

## Parte 8 — Landing page

- `src/app/_components/landing/pricing-simple.tsx`: confirmar features anunciadas ("Backup diário",
  "Relatórios financeiros", "Suporte por chat") ou marcar "em breve" / remover.
- Preço em **EUR** (hoje R$149) para PT/ES.
- Prova social/números só se reais; metadata/OG/SEO; consentimento de cookies antes de pixels.
- Hero já segue o padrão das inspirações — manter e polir.

---

## Próximo passo

Decidir a **região UE de hospedagem** → executar **Sprint 0 (P0)**. Cada item de infra/RGPD/billing/landing
recebe um plano de execução dedicado antes de alterar código.
