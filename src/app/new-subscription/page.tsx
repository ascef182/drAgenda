import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { PLANS, type Plan } from "@/lib/plans";

import { SubscriptionPlan } from "../(protected)/subscription/_components/subscription-plan";

function UpgradeCard({ plan }: { plan: Plan }) {
  return (
    <Card className="flex h-full flex-col border-border bg-card/60">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
          {plan.badge && (
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              {plan.badge}
            </span>
          )}
        </div>
        <p className="text-muted-foreground">{plan.tagline}</p>
        <div className="flex items-baseline gap-1">
          {plan.currency && (
            <span className="text-2xl font-bold text-foreground">
              {plan.currency}
            </span>
          )}
          <span
            className={cn(
              "font-extrabold tracking-tight text-foreground",
              plan.currency ? "text-4xl" : "text-2xl",
            )}
          >
            {plan.price}
          </span>
          {plan.period && (
            <span className="ml-1 text-muted-foreground">{plan.period}</span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        <div className="flex-1 space-y-4 border-t border-border pt-6">
          {plan.features.map((feature) => (
            <div key={feature} className="flex items-start">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              <p className="ml-3 text-foreground">{feature}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Button variant="outline" className="h-12 w-full text-base" disabled>
            {plan.badge ?? plan.ctaLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }

  const upgrades = PLANS.slice(1);

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-muted/40 to-background px-6 py-16">
      <div className="mb-10 w-full max-w-3xl text-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Desbloqueie todo o potencial da sua clínica
        </h1>
        <p className="mb-6 text-lg text-muted-foreground">
          Escolha o plano que se adapta à sua rotina e comece a transformar a
          gestão do seu consultório hoje.
        </p>
        <div className="mx-auto max-w-xl rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-medium text-foreground">
            🚀 Quem usa o DrAgenda economiza, em média,{" "}
            <span className="font-semibold">15 horas por semana</span> em tarefas
            administrativas. Chega de agenda manual e processos lentos.
          </p>
        </div>
      </div>

      <div className="grid w-full max-w-6xl items-stretch gap-6 lg:grid-cols-3">
        <SubscriptionPlan userEmail={session.user.email} />
        {upgrades.map((plan) => (
          <UpgradeCard key={plan.id} plan={plan} />
        ))}
      </div>

      <div className="mt-10 max-w-lg text-center">
        <p className="text-sm text-muted-foreground">
          Sem fidelidade · Cancele quando quiser. Garantia de satisfação de 30
          dias ou seu dinheiro de volta.
        </p>
      </div>
    </div>
  );
}
