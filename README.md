# DrAgenda

Modern practice management platform for medical clinics — built to increase revenue, automate workflows, and retain patients.

![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle_ORM-type--safe-C5F74F?style=flat)
![Stripe](https://img.shields.io/badge/Stripe-subscriptions-635BFF?style=flat&logo=stripe&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-utility--first-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

---

## About

DrAgenda is a multi-tenant SaaS platform built for medical clinics. Doctors and clinic managers get a unified workspace to handle scheduling, patient communication, billing, and analytics — all in one place.

Built solo under a production-grade architecture: Next.js 15 App Router, Server Actions, Stripe subscriptions, Google OAuth, and a WhatsApp automation layer in the roadmap.

| Tecnologia | Propósito |
|------------|-----------|
| Next.js 15 (App Router) | Framework React moderno com server components |
| TypeScript (strict) | Linguagem com tipagem estática |
| Drizzle ORM | ORM type-safe para PostgreSQL |
| PostgreSQL | Banco de dados relacional |
| Better Auth | Autenticação (email/senha + Google OAuth) |
| Stripe | Sistema de assinaturas e pagamentos |
| Sentry | Monitoramento de erros e performance |
| Upstash Redis | Rate limiting distribuído |
| shadcn/ui | Componentes UI baseados em Radix UI |
| Tailwind CSS v4 | Estilização utility-first |
| React Query (TanStack) | Cache de dados no cliente |
| dayjs | Manipulação de datas/horas |

## Features

**For Clinics**
- Multi-tenant structure — each clinic is fully isolated
- Doctor management with configurable availability
- Smart appointment scheduling with conflict prevention
- Analytics dashboard with revenue and occupancy metrics
- Stripe subscription system with plan management
- WhatsApp automation preparation (roadmap)
- Error monitoring with Sentry
- Distributed rate limiting with Upstash Redis
- Health check endpoint for uptime monitors
- Security headers (HSTS, X-Content-Type-Options, etc.)
- CI pipeline with GitHub Actions

**For Patients**
- Online booking flow
- Appointment reminders and confirmations via WhatsApp *(roadmap)*
- Patient history and communication tracking

**Technical Highlights**
- Server Actions with Zod validation — no REST boilerplate
- Type-safe queries with Drizzle ORM + PostgreSQL
- Google OAuth via Better Auth
- Stripe Checkout + Webhooks for subscription lifecycle
- Tailwind CSS v4 + shadcn/ui design system
- React Query for client-side cache management

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15 (App Router), React, TypeScript (strict) |
| Database | PostgreSQL, Drizzle ORM |
| Auth | Better Auth — email/password + Google OAuth |
| Payments | Stripe — Checkout Sessions + Webhooks |
| UI | Tailwind CSS v4, shadcn/ui, Radix UI |
| State | TanStack React Query |
| Date handling | dayjs |

## Architecture

```
src/
├── app/
│   ├── (protected)/        # Authenticated routes
│   └── api/                # API routes + Stripe webhook
├── actions/                # Server Actions (Zod-validated)
├── components/
│   └── ui/                 # shadcn/ui primitives
├── db/                     # Drizzle ORM schema + migrations
├── lib/                    # Shared singletons and utilities
└── helpers/                # Pure helper functions
```

The project follows clean architecture principles:
- **UI Layer** — React components and pages
- **Application Layer** — Server Actions for orchestration
- **Domain Layer** — Services with business rules
- **Infrastructure Layer** — Repository pattern and database access

## Quick Start

**Prerequisites:** Node.js 18+, PostgreSQL (local or Neon), Stripe account, Google OAuth credentials

```bash
# 1. Clone and install
git clone https://github.com/your-username/dragenda.git
cd dragenda
npm install

# 2. Configure environment
cp .env.example .env
# Fill in your credentials (see Environment Variables)

# 3. Set up database (Docker)
docker run -d --name dragenda-db \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 postgres

docker exec -it dragenda-db psql -U postgres \
  -c "CREATE DATABASE \"drAgenda\";"

# 4. Apply migrations
npm run db:generate
npm run db:migrate

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://...

# Auth
BETTER_AUTH_SECRET=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_ESSENTIAL_PLAN_PRICE_ID=price_...

# Google OAuth (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Sentry (opcional — deixa vazio para desabilitar)
NEXT_PUBLIC_SENTRY_DSN=https://...

# Upstash Redis (opcional — sem ele, rate limiting vira no-op)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```


## Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Configurar banco (Docker)
docker run -d --name dragenda-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres

# Criar banco
docker exec -it dragenda-db psql -U postgres -c "CREATE DATABASE \"drAgenda\";"

# Gerar migrations
npm run db:generate

# Aplicar migrations
npm run db:migrate

# Iniciar servidor
npm run dev
```

## Estrutura de Pastas

```
src/
├── app/                    # Next.js App Router
│   ├── (protected)/      # Rotas autenticadas
│   ├── api/              # API routes (stripe/webhook, health)
│   └── authentication/   # Login/register
├── actions/              # Server Actions
├── services/             # Regras de negócio (domain layer)
├── data/                 # Repositories (acesso ao banco)
├── components/           # Componentes React
│   └── ui/              # shadcn/ui
├── db/                  # Drizzle ORM + schema
├── lib/                 # Utilitários (auth, session, ratelimit)
├── helpers/             # Funções auxiliares
└── providers/           # React providers
```

## Deploy

**Vercel + Neon (PostgreSQL)**

1. Create a free PostgreSQL database on [Neon](https://neon.tech)
2. Connect the repository on Vercel
3. Add all environment variables in the Vercel dashboard
   - `DATABASE_URL`, `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `SENTRY_*` (optional), `UPSTASH_*` (optional), `GOOGLE_*` (optional)
4. Set up Stripe webhooks pointing to `https://your-site.vercel.app/api/stripe/webhook`
5. Update `NEXT_PUBLIC_APP_URL` to your production domain

## Roadmap

- [x] Service layer for appointments
- [x] Session helper (requireUser, requireClinic)
- [x] Security headers + rate limiting
- [x] Sentry monitoring
- [ ] Service layer for doctors and patients
- [ ] RBAC — role-based access control
- [ ] Audit log
- [ ] WhatsApp automation (Twilio)
- [ ] Financial module with invoicing
- [ ] Electronic medical records (EMR)

## License

MIT
