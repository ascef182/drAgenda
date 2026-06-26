import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PLANS, type Plan } from "@/lib/plans";

import { Reveal } from "./reveal";

function PlanCard({ plan }: { plan: Plan }) {
  const isNumericPrice = Boolean(plan.currency);

  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card p-8",
        plan.highlighted
          ? "border-primary/40 shadow-xl shadow-primary/10 ring-1 ring-primary/20 md:scale-[1.03]"
          : "border-border shadow-sm",
      )}
    >
      {plan.highlighted && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
        />
      )}
      {plan.highlighted && (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 right-0 size-64 rounded-full bg-primary/10 blur-3xl"
        />
      )}

      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
          {plan.badge && (
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                plan.highlighted
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {plan.badge}
            </span>
          )}
        </div>

        <p className="mt-2 min-h-[2.5rem] text-sm text-muted-foreground">
          {plan.tagline}
        </p>

        <div className="mt-6 flex items-baseline gap-1.5">
          {plan.currency && (
            <span className="text-2xl font-bold text-foreground">
              {plan.currency}
            </span>
          )}
          <span
            className={cn(
              "font-extrabold tracking-tight text-foreground",
              isNumericPrice ? "text-5xl" : "text-3xl",
            )}
          >
            {plan.price}
          </span>
          {plan.period && (
            <span className="text-base font-medium text-muted-foreground">
              {plan.period}
            </span>
          )}
        </div>

        <div className="mt-8 h-px w-full bg-border/60" />

        <ul className="mt-6 flex-1 space-y-3">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 text-sm text-foreground"
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <Button
          asChild
          size="lg"
          variant={plan.highlighted ? "default" : "outline"}
          className={cn(
            "mt-8 h-12 w-full text-base",
            plan.highlighted &&
              "shadow-lg shadow-primary/30 transition-all duration-200 hover:shadow-primary/50 hover:brightness-110",
          )}
        >
          <Link href="/authentication">
            {plan.ctaLabel}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function PricingSimple() {
  return (
    <section className="py-20 md:py-28" id="pricing">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Investimento
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Um valor justo. Sem fidelidade.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comece grátis. Continue por menos que uma consulta particular por
            mês.
          </p>
        </Reveal>

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.id} delay={150 + i * 100} className="h-full">
              <PlanCard plan={plan} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={450}>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Sem fidelidade · Cancele quando quiser. Precisa de algo sob medida?{" "}
            <Link
              href="/authentication"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Fale com a gente
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
