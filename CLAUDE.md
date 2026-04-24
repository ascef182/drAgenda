# DrAgenda — Ground Truth Document

> Este arquivo é a fonte da verdade do projeto.
> Qualquer desenvolvedor (humano ou IA) deve lê-lo antes de escrever qualquer linha de código.
> Se uma decisão não está aqui, não foi tomada ainda — discuta antes de implementar.

---

## 1. Visão do Produto

DrAgenda é um **SaaS multi-tenant para clínicas médicas** focado em:

- **Crescimento de receita**: agenda inteligente, faturamento, relatórios financeiros
- **Automação**: lembretes de consulta, confirmações, follow-ups via WhatsApp
- **Retenção de pacientes**: histórico, comunicação ativa, fidelização
- **Gestão**: controle de médicos, pacientes, horários, planos de assinatura

### Módulos planejados (roadmap)

| Módulo | Status | Prioridade |
|--------|--------|-----------|
| Auth (email + Google) | ✅ Implementado | — |
| Multi-clínica (estrutura) | ✅ Implementado | — |
| Médicos (CRUD) | ✅ Implementado | — |
| Pacientes (CRUD) | ✅ Implementado | — |
| Agendamentos (CRUD) | ✅ Implementado | — |
| Dashboard analytics | ✅ Implementado | — |
| Assinatura Stripe | ✅ Implementado | — |
| **Session helper compartilhado** | ✅ Implementado | P0 |
| **Segurança + Service Layer (appointments)** | ✅ Implementado | P0 |
| **Middleware de auth** | ✅ Implementado | P0 |
| **DEV MODE (env guards, seed)** | ✅ Implementado | P0 |
| **Service Layer (doctors, patients)** | 🔴 Pendente | P0 |
| **RBAC (papéis na clínica)** | 🟡 Planejado | P1 |
| **Audit Log** | 🟡 Planejado | P1 |
| **WhatsApp Automation** | 🟡 Planejado | P1 |
| **Módulo Financeiro** | 🟡 Planejado | P2 |
| **Multi-clínica (UX)** | 🟡 Planejado | P2 |
| **Prontuário eletrônico** | ⚪ Futuro | P3 |

---

## 2. Stack Técnica

```
Next.js 15 (App Router)     — framework principal
TypeScript (strict)         — linguagem
Drizzle ORM                 — ORM type-safe para PostgreSQL
PostgreSQL                  — banco de dados principal
better-auth 1.2.8           — autenticação (email/senha + Google OAuth)
next-safe-action            — server actions type-safe com Zod
Zod                         — validação de schemas
Tailwind CSS v4             — estilização
shadcn/ui                   — componentes base (Radix UI)
React Query (TanStack)      — cache de dados no cliente
Stripe                      — pagamentos e assinaturas
dayjs                       — manipulação de datas/horas
```

---

## 3. Arquitetura Alvo

### Princípio Central

**Cada camada tem uma única responsabilidade. Nenhuma camada pula outra.**

```
UI (React Components / Pages)
    ↓ chama
Server Actions              ← orquestração: auth check → service → revalidação
    ↓ chama
Services                    ← lógica de negócio, regras do domínio, domain events
    ↓ chama
Data / Repository           ← acesso ao banco, queries SQL puras
    ↓ usa
Database (Drizzle + Postgres)
```

### Estrutura de Pastas Alvo

```
src/
├── app/                          # Camada UI — Next.js routes
│   ├── (protected)/              # Rotas que exigem auth + clinic + plan
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   ├── doctors/
│   │   ├── patients/
│   │   ├── appointments/
│   │   └── subscription/
│   ├── api/
│   │   ├── auth/[...all]/route.ts
│   │   └── stripe/webhook/route.ts
│   └── authentication/
│
├── actions/                      # Camada de Aplicação — Server Actions
│   └── [verb]-[noun]/
│       ├── index.ts              # auth check → service call → revalidate
│       └── schema.ts             # Zod schema (contrato de input)
│
├── services/                     # Camada de Domínio — Regras de Negócio
│   ├── appointments.ts           # ✅ Implementado
│   ├── messaging.ts              # ✅ Interface definida (impl. Fase 5)
│   ├── doctors.ts                # 🔴 Pendente
│   ├── patients.ts               # 🔴 Pendente
│   └── [future: financial.ts, audit.ts]
│
├── data/                         # Camada de Infraestrutura — Acesso ao Banco
│   ├── appointments.ts           # ✅ Implementado
│   ├── doctors.ts                # ✅ Implementado (básico)
│   ├── patients.ts               # ✅ Implementado (básico)
│   └── dashboard.ts              # 🔴 Mover de src/data/get-dashboard.ts
│
├── db/
│   ├── index.ts                  # conexão Drizzle
│   └── schema.ts                 # schema único de todas as tabelas
│
├── lib/
│   ├── auth.ts                   # config better-auth
│   ├── auth-client.ts            # client-side auth hooks
│   ├── session.ts                # ✅ requireUser() e requireClinic()
│   ├── next-safe-action.ts       # actionClient
│   └── utils.ts
│
├── components/
│   └── ui/                       # shadcn/ui primitives (não modificar)
│
├── hooks/                        # React hooks compartilhados
├── helpers/                      # funções puras utilitárias (currency, time)
├── providers/                    # React providers (QueryClient, etc.)
└── middleware.ts                 # proteção de rotas no edge (🔴 Pendente)
```

### Regras de Importação (obrigatório)

| De | Pode importar de | NUNCA importar de |
|----|-----------------|-------------------|
| `app/` | `actions/`, `data/`, `lib/`, `components/`, `hooks/` | `services/`, `db/` direto |
| `actions/` | `services/`, `lib/`, `db/schema` (tipos) | `db/index` direto |
| `services/` | `data/`, `lib/`, `helpers/`, `db/schema` (tipos) | `actions/`, `app/` |
| `data/` | `db/`, `lib/` | `services/`, `actions/`, `app/` |

> **Regra de ouro**: Server Actions NÃO contêm lógica de negócio. São apenas orquestradores finos.

---

## 4. Segurança — Regras Não Negociáveis

Este é um SaaS médico. Violações de segurança têm consequências legais e éticas graves.

### 4.1 Autenticação e Sessão

- **SEMPRE** use `requireClinic()` ou `requireUser()` de `@/lib/session` como PRIMEIRA instrução de todo server action
- **NUNCA** confie em dados enviados pelo cliente para identificar a clínica — use sempre `session.user.clinic.id`
- A sessão é a fonte da verdade de identidade

```typescript
// ✅ CORRETO
const session = await requireClinic();
const clinicId = session.user.clinic.id; // vem da sessão server-side

// ❌ ERRADO — nunca aceite clinicId do cliente como input de autorização
export const myAction = actionClient
  .schema(z.object({ clinicId: z.string() })) // ← NUNCA FAÇA ISSO
  .action(async ({ parsedInput }) => {
    await db.query.doctors.where(eq(doctors.clinicId, parsedInput.clinicId));
  });
```

### 4.2 Isolamento Multi-Tenant (Crítico)

- **TODO** dado lido do banco DEVE ser filtrado por `clinicId`
- **TODO** update/delete DEVE verificar ownership antes de executar
- O padrão de ownership check é feito na **Service Layer**, nunca na action

```typescript
// services/appointments.ts — ownership check AQUI, não na action
async delete(id: string, clinicId: string) {
  const appointment = await AppointmentRepository.findById(id);
  if (!appointment || appointment.clinicId !== clinicId) {
    throw new Error("Agendamento não encontrado"); // mensagem genérica
  }
  await AppointmentRepository.delete(id);
}
```

### 4.3 Mensagens de Erro

- **NUNCA** retorne mensagens que confirmem existência de recurso para quem não tem acesso
- Use mensagens genéricas que não vazam informação
  - ✅ `"Médico não encontrado"`
  - ❌ `"Você não tem permissão para editar este médico"` ← confirma existência

### 4.4 Validação de Input

- Todo server action DEVE ter schema Zod com tipos estritos
- UUIDs: sempre `z.string().uuid()`
- Enums: sempre `z.enum([...])`
- Campos de autorização (`clinicId`, `userId`) NUNCA como input de action

### 4.5 Webhook Stripe

- **SEMPRE** verificar assinatura com `stripe.webhooks.constructEvent`
- **NUNCA** processar eventos sem verificação de assinatura

### 4.6 Variáveis de Ambiente

- Segredos: `DATABASE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `GOOGLE_CLIENT_SECRET`
- Nunca com prefixo `NEXT_PUBLIC_` para segredos

---

## 5. Domain Events (crítico para automação futura)

Os Services devem emitir eventos internos após cada mutação bem-sucedida.
Eventos permitem extensibilidade sem acoplamento entre módulos.

### Eventos definidos

| Evento | Emitido por | Consumidores futuros |
|--------|-------------|---------------------|
| `appointment.created` | `AppointmentService.create` | MessagingService, AuditService, FinancialService |
| `appointment.cancelled` | `AppointmentService.delete` | MessagingService, AuditService |
| `doctor.onboarded` | `DoctorService.upsert` | AuditService |
| `patient.created` | `PatientService.upsert` | AuditService |
| `patient.inactive` | `PatientService` (futuro) | MessagingService |
| `payment.completed` | `FinancialService` (futuro) | AuditService, Analytics |

### Padrão de implementação

```typescript
// Fase atual: eventos são no-op com extension points explícitos
// Fase 4: substituir o corpo por chamadas reais aos serviços
async function emitEvent(event: DomainEvent): Promise<void> {
  try {
    // Fase 4: await AuditService.log(event);
    // Fase 5: await MessagingService.handleEvent(event);
    // Fase 6: await FinancialService.handleEvent(event);
  } catch {
    // Falha no evento NUNCA reverte a operação principal
    // Fase 4: logger.error("Event emission failed", { event });
  }
}
```

### Regras

1. Eventos são emitidos APÓS a persistência bem-sucedida
2. Falha na emissão do evento NÃO reverte a transação (try/catch obrigatório)
3. Definir o tipo do evento é obrigatório mesmo antes da implementação
4. Cada evento carrega o `clinicId` — sempre

---

## 6. Messaging Architecture

### Provider: WhatsApp Business API via Twilio

### Regra de isolamento (lei do projeto)

```
AppointmentService → MessagingService → TwilioProvider (futuro)
```

**NUNCA** importe Twilio diretamente em services de domínio.
Trocar de Twilio para Z-API = mudar apenas `src/providers/twilio.ts`.

### Interface (definida agora, implementada na Fase 5)

```typescript
// src/services/messaging.ts — provider-agnostic
MessagingService.sendAppointmentConfirmation(payload)
MessagingService.sendAppointmentReminder(payload)    // triggered 24h antes
MessagingService.sendAppointmentCancellation(payload)
```

### Tabela de tracking (Fase 5)

```sql
CREATE TABLE message_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  type TEXT NOT NULL,       -- 'reminder_24h', 'confirmation', 'cancellation'
  status TEXT NOT NULL,     -- 'pending', 'sent', 'failed'
  provider TEXT NOT NULL,   -- 'twilio', 'z-api'
  sent_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 7. Usage-Based Billing (preparação para escala)

Cada mensagem WhatsApp é uma unidade faturável.
A estrutura deve ser preparada agora para evitar refactoring posterior.

### Evento de uso

```typescript
type UsageEvent = {
  clinicId: string;
  type: "whatsapp_message" | "sms" | "email";
  quantity: number;
  metadata?: Record<string, unknown>;
};
```

### Tabela futura: `usage_events` (Fase 6)

```sql
CREATE TABLE usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Integração Stripe Metered Billing

- Cada `usage_event` gera um `stripe.subscriptionItems.createUsageRecord()`
- Permite cobrar por mensagem além da cota do plano base
- Implementar na Fase 6 junto ao módulo financeiro

---

## 8. Schema do Banco de Dados

### Estado Atual

```
users                     → autenticação (better-auth)
sessions                  → sessões ativas
accounts                  → OAuth providers
verifications             → verificação de email
clinics                   → clínicas
users_to_clinics          → relação user ↔ clinic (N:N)
doctors                   → médicos (scoped por clinicId)
patients                  → pacientes (scoped por clinicId)
appointments              → agendamentos (scoped por clinicId)
```

### Evoluções Planejadas (em ordem)

**P0 — Double-booking prevention:**
```sql
-- Adicionar no schema Drizzle + gerar migration
UNIQUE (doctor_id, date) ON appointments
```

**P1 — RBAC:**
```sql
ALTER TABLE users_to_clinics ADD COLUMN role TEXT NOT NULL DEFAULT 'owner';
-- Valores: 'owner' | 'admin' | 'member'
```

**P1 — Audit Log:**
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**P1 — WhatsApp tracking:** ver seção 6

**P2 — Financeiro:**
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  amount_in_cents INTEGER NOT NULL,
  method TEXT NOT NULL,     -- 'cash', 'credit_card', 'pix', 'health_plan'
  status TEXT NOT NULL,     -- 'pending', 'paid', 'refunded'
  paid_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 9. Convenções de Nomenclatura

### Arquivos e Pastas

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Server action | `src/actions/[verb]-[noun]/index.ts` | `delete-doctor/index.ts` |
| Schema Zod | Co-localizado com action | `upsert-doctor/schema.ts` |
| Service | `src/services/[noun].ts` | `appointments.ts` |
| Repository | `src/data/[noun].ts` | `appointments.ts` |
| Componente de rota | `_components/[noun]-[descriptor].tsx` | `doctor-card.tsx` |

### Exports

| Camada | Padrão | Exemplo |
|--------|--------|---------|
| Services | `NounService.verb()` | `AppointmentService.create()` |
| Repositories | `NounRepository.verb()` | `AppointmentRepository.findById()` |
| Actions | named export | `export const deleteAppointment = ...` |

### Banco de Dados

- Tabelas: `snake_case` plural → `appointments`, `users_to_clinics`
- Colunas: `snake_case` → `clinic_id`, `available_from_time`
- Drizzle TypeScript: `camelCase` → `clinicId`, `availableFromTime`
- Constraints: `[tabela]_[colunas]_unique` → `appointments_doctor_date_unique`

---

## 10. Padrões de Código

### Server Action (padrão obrigatório)

```typescript
"use server";
import { revalidatePath } from "next/cache";
import { requireClinic } from "@/lib/session";
import { actionClient } from "@/lib/next-safe-action";
import { AppointmentService } from "@/services/appointments";
import { mySchema } from "./schema";

export const myAction = actionClient
  .schema(mySchema)
  .action(async ({ parsedInput }) => {
    const session = await requireClinic();          // 1. auth
    await AppointmentService.create(               // 2. service
      parsedInput,
      session.user.clinic.id,
    );
    revalidatePath("/appointments");               // 3. revalidate
  });
```

### Service (padrão obrigatório)

```typescript
export const AppointmentService = {
  async create(data: CreateInput, clinicId: string) {
    // 1. Ownership checks
    // 2. Business rules (availability, conflicts)
    // 3. Persist via repository
    // 4. Emit domain event (try/catch)
  },
};
```

### Repository (padrão obrigatório)

```typescript
export const AppointmentRepository = {
  findById: (id: string) =>
    db.query.appointmentsTable.findFirst({ where: eq(appointmentsTable.id, id) }),

  insert: (data: typeof appointmentsTable.$inferInsert) =>
    db.insert(appointmentsTable).values(data).returning(),
};
```

---

## 11. Roadmap de Implementação — Passo a Passo

### FASE 1 — Fundação Segura (P0) ← EM EXECUÇÃO

#### 1.1 ✅ `src/lib/session.ts`
- Exporta `requireUser()` e `requireClinic()`
- Usa `React.cache()` para deduplicar na mesma request

#### 1.2 ✅ `src/data/doctors.ts`
- `DoctorRepository`: `findById`, `findByClinic`, `upsert`, `delete`

#### 1.3 ✅ `src/data/patients.ts`
- `PatientRepository`: `findById`, `findByClinic`, `upsert`, `delete`

#### 1.4 ✅ `src/data/appointments.ts`
- `AppointmentRepository`: `findById`, `findByClinic`, `findByDoctorAndDate`, `insert`, `delete`

#### 1.5 ✅ `src/services/appointments.ts`
- `AppointmentService`: `create`, `delete`, `getAvailableSlots`
- Ownership checks, domain events, extension points

#### 1.6 ✅ `src/services/messaging.ts`
- Interface provider-agnostic definida
- Stubs com comentários de implementação futura

#### 1.7 ✅ Refatorar actions de appointments
- `add-appointment`: usa `AppointmentService.create` + `requireClinic`
- `delete-appointment`: usa `AppointmentService.delete` + `requireClinic`
- `get-available-times`: usa `AppointmentService.getAvailableSlots` + `requireClinic`

#### 1.8 🔴 `src/db/schema.ts`
- Adicionar constraint `unique` em `appointmentsTable(doctorId, date)`
- Gerar migration: `npx drizzle-kit generate` → `npx drizzle-kit migrate`

#### 1.9 🔴 `src/middleware.ts`
- Proteção de rotas no edge
- Verificar sessão, redirecionar para `/authentication` se inválida

### FASE 2 — Service Layer (doctors, patients) (P0)

#### 2.1 🔴 `src/services/doctors.ts`
- `DoctorService.upsert(data, clinicId)`: ownership check, UTC conversion, domain event
- `DoctorService.delete(id, clinicId)`: ownership check, domain event

#### 2.2 🔴 Refatorar actions de doctors
- `upsert-doctor` e `delete-doctor` usam `DoctorService` + `requireClinic`

#### 2.3 🔴 `src/services/patients.ts`
- `PatientService.upsert(data, clinicId)`: ownership check, domain event
- `PatientService.delete(id, clinicId)`: ownership check, domain event

#### 2.4 🔴 Refatorar actions de patients
- `upsert-patient` e `delete-patient` usam `PatientService` + `requireClinic`

#### 2.5 🔴 Atualizar `create-clinic` e `create-stripe-checkout`
- Usar `requireUser()` (sem clinic requirement)

#### 2.6 🔴 Mover `src/data/get-dashboard.ts` → `src/data/dashboard.ts`

### FASE 3 — RBAC (P1)

#### 3.1 🔴 Migration: `role` em `users_to_clinics`
#### 3.2 🔴 Expor `clinicRole` na sessão via `customSession`
#### 3.3 🔴 `requireRole(minRole)` em `src/lib/session.ts`
#### 3.4 🔴 Aplicar em actions destrutivas

### FASE 4 — Audit Log (P1)

#### 4.1 🔴 Migration: tabela `audit_logs`
#### 4.2 🔴 `src/services/audit.ts` + `src/data/audit.ts`
#### 4.3 🔴 Ativar extension points nos services (Fases 1-2)

### FASE 5 — WhatsApp (P1)

#### 5.1 🔴 `src/providers/twilio.ts` (implementação concreta)
#### 5.2 🔴 Implementar `MessagingService` com Twilio
#### 5.3 🔴 Migration: `message_logs`
#### 5.4 🔴 Cron job para lembretes 24h

### FASE 6 — Financeiro + Metered Billing (P2)

#### 6.1 🔴 Migration: `payments` + `usage_events`
#### 6.2 🔴 `src/services/financial.ts`
#### 6.3 🔴 Stripe metered billing integration

### FASE 7 — Multi-clínica UX (P2)

#### 7.1 🔴 Remover hardcode `clinics?.[0]` de `src/lib/auth.ts`
#### 7.2 🔴 `activeClinicId` como cookie de preferência
#### 7.3 🔴 Clinic switcher no sidebar

---

## 12. O que NÃO fazer

- ❌ Não acesse `db` diretamente dentro de server actions
- ❌ Não coloque lógica de negócio dentro de componentes React
- ❌ Não passe `clinicId` como input de action vindo do frontend
- ❌ Não importe providers externos (Twilio, etc.) dentro de services de domínio
- ❌ Não crie abstrações antes de ter 3+ casos de uso idênticos
- ❌ Não use `any` — TypeScript strict está ativo
- ❌ Não ignore extension points comentados — são tarefas futuras explícitas

---

## 13. Fluxo de Decisão para Nova Feature

1. Qual tabela(s) é afetada? → Migration necessária?
2. Quem pode executar? → Qual papel no RBAC?
3. Qual clínica? → Como isolar por `clinicId`?
4. Precisa de audit log? → Se muta dado sensível, sim
5. Precisa de WhatsApp? → Se envolve paciente, provavelmente sim
6. O service layer existe? → Se não, crie antes da action

---

## 14. Local Development

### Setup rápido

```bash
# 1. Instalar dependências
npm install --legacy-peer-deps

# 2. Configurar ambiente (edite DATABASE_URL para seu PostgreSQL)
cp .env.example .env.local

# 3. Subir PostgreSQL com Docker (se não tiver local)
docker run -d --name dragenda-db \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 postgres

# 4. Criar tabelas
npm run db:migrate

# 5. Popular com dados de exemplo
npm run db:seed

# 6. Iniciar o servidor
npm run dev
```

### DEV MODE

DEV MODE ativa automaticamente quando `STRIPE_SECRET_KEY=sk_test_dummy` (padrão em `.env.local`).

| Comportamento | Dev Mode | Produção |
|--------------|----------|----------|
| Stripe checkout | Mock (retorna session fake) | API real |
| WhatsApp messages | `console.log` | Twilio API real |
| Google OAuth | Desabilitado se credenciais vazias | Ativo |
| DATABASE_URL | Necessário real | Necessário real |

### Scripts disponíveis

```bash
npm run dev          # servidor local (http://localhost:3000)
npm run build        # build de produção
npm run db:generate  # gera migrations a partir do schema
npm run db:migrate   # aplica migrations no banco
npm run db:studio    # Drizzle Studio (visualizar dados)
npm run db:seed      # popula banco com dados de exemplo
```

---

## 15. Business-Critical Flows (prioridade de produto)

Os seguintes fluxos impactam diretamente receita. Toda nova feature deve se conectar a pelo menos um deles.

### 1. Appointment Creation Flow ← implementado
- Criar agendamento com validação de disponibilidade
- Verificar ownership de médico e paciente (cross-tenant protection)
- Constraint DB previne double-booking em race conditions
- Extension point: confirmação WhatsApp (Fase 5)
- Extension point: registro financeiro (Fase 6)

### 2. Appointment Reminder Flow ← Fase 5
- Identificar consultas com 24h de antecedência
- Disparar lembrete automático via `MessagingService.sendAppointmentReminder()`
- Registrar em `message_logs` com status `sent/failed`
- Interface já definida em `src/services/messaging.ts`

### 3. Patient Reactivation Flow ← Fase 5
- Identificar pacientes sem consulta há mais de 6 meses
- Disparar mensagem automática de reativação
- Medir conversão (agendamento após mensagem)
- Gatilho: cron job semanal

### 4. Revenue Tracking Flow ← Fase 6
- Registrar pagamento de consulta em `payments`
- Separar cotação (`appointmentPriceInCents`) de pagamento real
- Atualizar métricas do dashboard com receita confirmada
- Extension point já marcado em `AppointmentService.create()`

---

## 16. Contexto de Negócio

- **Preços em centavos**: `15000` = R$ 150,00
- **Horários em UTC no banco**: converter na exibição para timezone do usuário
- **Disponibilidade médica**: `availableFromWeekDay` a `availableToWeekDay` (0=Dom, 6=Sáb)
- **Pacientes são scoped por clínica**: mesmo paciente pode existir em 2 clínicas (correto por design)
- **Plano de assinatura está no `user`**: limitação atual, rever na Fase 7
- **Stripe webhook usa `metadata.userId`**: não `clinicId` — usuário cria a clínica
