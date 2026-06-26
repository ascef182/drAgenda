/**
 * Fonte única dos planos/preços do DrAgenda.
 *
 * Consumido pela landing (`pricing-simple.tsx`), pelo card de assinatura in-app
 * (`subscription-plan.tsx`) e pela página de onboarding (`new-subscription`).
 * Centralizar aqui evita divergência de preço/feature entre as telas.
 *
 * Regra de produto: só o tier `essential` é comprável hoje (tem price ID real no
 * Stripe). Os tiers superiores vendem capacidades ainda em construção
 * (WhatsApp, RBAC, auditoria, multi-clínica em escala) e por isso usam CTA de
 * lista de espera / contato — nunca um checkout Stripe.
 */

export type PlanCtaType = "checkout" | "waitlist" | "contact";

export interface Plan {
  id: "essential" | "pro" | "enterprise";
  name: string;
  /** Frase curta de posicionamento, abaixo do nome. */
  tagline: string;
  /** Valor formatado para exibição (ex.: "69", "129", "Sob consulta"). */
  price: string;
  /** Símbolo da moeda quando há valor numérico (ex.: "€"). */
  currency?: string;
  /** Período do valor (ex.: "/mês"). Omitido quando price não é numérico. */
  period?: string;
  /** Selo opcional no topo do card (ex.: "Em breve", "Recomendado"). */
  badge?: string;
  /** Destaque visual — o plano "recomendado" na tabela. */
  highlighted: boolean;
  features: string[];
  ctaType: PlanCtaType;
  ctaLabel: string;
}

export const PLANS: Plan[] = [
  {
    id: "essential",
    name: "Essential",
    tagline: "Para autônomos e clínicas que querem sair da planilha.",
    price: "69",
    currency: "€",
    period: "/mês",
    highlighted: false,
    features: [
      "Médicos ilimitados",
      "Pacientes ilimitados",
      "Agenda à prova de conflito",
      "Dashboard com analytics e financeiro",
      "Login com e-mail ou Google",
      "Suporte por e-mail",
    ],
    ctaType: "checkout",
    ctaLabel: "Começar agora",
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Automação e equipe — para clínicas em ritmo de crescimento.",
    price: "129",
    currency: "€",
    period: "/mês",
    badge: "Em breve",
    highlighted: true,
    features: [
      "Tudo do Essential",
      "Lembretes e confirmações automáticas por WhatsApp",
      "Papéis e permissões para a equipe",
      "Registro de auditoria das ações",
      "Suporte prioritário",
    ],
    ctaType: "waitlist",
    ctaLabel: "Entrar na lista de espera",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Para redes e operações multi-clínica em escala.",
    price: "Sob consulta",
    highlighted: false,
    features: [
      "Tudo do Pro",
      "Multi-clínica em escala",
      "Onboarding dedicado",
      "SLA e suporte dedicado",
      "Integrações sob medida",
    ],
    ctaType: "contact",
    ctaLabel: "Falar com a gente",
  },
];

/** O plano comprável (único com checkout Stripe nesta fase). */
export const ESSENTIAL_PLAN = PLANS[0];
