# DrAgenda

Software de gestão para clínicas médicas construído com tecnologia moderna, focado em crescimento de receita, automação de processos e retenção de pacientes.

## Visão do Produto

DrAgenda é um SaaS multi-tenant para clínicas médicas que oferece:

- **Crescimento de receita**: agenda inteligente, faturamento, relatórios financeiros
- **Automação**: lembretes de consulta, confirmações, follow-ups via WhatsApp
- **Retenção de pacientes**: histórico, comunicação ativa, fidelização
- **Gestão**: controle de médicos, pacientes, horários, planos de assinatura

## Stack Técnica

| Tecnologia | Propósito |
|------------|-----------|
| Next.js 15 (App Router) | Framework React moderno com server components |
| TypeScript (strict) | Linguagem com tipagem estática |
| Drizzle ORM | ORM type-safe para PostgreSQL |
| PostgreSQL | Banco de dados relacional |
| Better Auth | Autenticação (email/senha + Google OAuth) |
| Stripe | Sistema de assinaturas e pagamentos |
| shadcn/ui | Componentes UI baseados em Radix UI |
| Tailwind CSS v4 | Estilização utility-first |
| React Query (TanStack) | Cache de dados no cliente |
| dayjs | Manipulação de datas/horas |

## Funcionalidades

- Autenticação segura (email/senha + Google)
- Estrutura multi-clínica (multi-tenant)
- Gestão de médicos com disponibilidade
- Gestão de pacientes
- Agendamentos inteligentes
- Dashboard analytics
- Sistema de assinaturas via Stripe
- Preparação para automação via WhatsApp

## Como Testar

Para testar o sistema em modo sandbox, utilize os dados de cartão de teste do Stripe:

| Campo | Valor |
|-------|-------|
| Número do cartão | `4242 4242 4242 4242` |
| Data de validade | Qualquer data futura (ex: `12/34`) |
| CVC | Qualquer 3 dígitos (ex: `123`) |

## Variáveis de Ambiente

```bash
# Banco de dados
DATABASE_URL=postgresql://...

# Autenticação
BETTER_AUTH_SECRET=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe (teste)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_ESSENTIAL_PLAN_PRICE_ID=price_...

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
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
│   └── api/              # API routes
├── actions/              # Server Actions
├── components/           # Componentes React
│   └── ui/              # shadcn/ui
├── db/                  # Drizzle ORM
├── lib/                 # Utilitários
└── helpers/             # Funções auxiliares
```

## Deploy

O projeto está preparado para deploy na Vercel com as seguintes variáveis:

1. **DATABASE_URL** - String de conexão do PostgreSQL (Neon recomendado)
2. **BETTER_AUTH_SECRET** - Chave de autenticação
3. **NEXT_PUBLIC_APP_URL** - URL do domínio
4. **STRIPE_*** - Chaves do Stripe
5. **GOOGLE_*** - Credenciais Google OAuth (opcional)

## Roadmap

### Funcionalidades Planejadas

- [ ] Service layer para doctors e patients
- [ ] RBAC (controle de acesso por papéis)
- [ ] Audit log
- [ ] Automação WhatsApp (Twilio)
- [ ] Módulo financeiro
- [ ] Prontuário eletrônico

### Arquitetura de Domínio

O projeto segue princípios de clean architecture com:

- **UI Layer**: Componentes React e páginas
- **Application Layer**: Server Actions para orquestração
- **Domain Layer**: Services com regras de negócio
- **Infrastructure Layer**: Repository pattern e acesso ao banco

## Licença

MIT